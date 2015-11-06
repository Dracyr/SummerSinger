defmodule GrooveLion.AudioPlayer do
  alias Porcelain.Process, as: Proc

  def start_link do
    {:ok, sup_pid} = Task.Supervisor.start_link(name: GrooveLion.AudioBackendSupervisor)
    {:ok, controller_pid} = Task.Supervisor.start_child(
      GrooveLion.AudioBackendSupervisor, fn -> await_proc() end)
    {:ok, backend_pid} = Task.Supervisor.start_child(
      GrooveLion.AudioBackendSupervisor, GrooveLion.AudioPlayer, :start_backend, [controller_pid])

    Process.register(controller_pid, :audio_player)

    {:ok, sup_pid}
  end

  def start_backend(controller_pid) do
    proc = %Proc{pid: backend_pid} =
      Porcelain.spawn_shell("mpg123 -R", in: :receive, out: {:send, controller_pid})
    {:ok, backend_pid}
  end

  defp await_proc() do
    default_state = %{
      current_status: "stopped",
      start_time: nil, # Epoch in milliseconds
      duration: nil # In Milliseconds
    }

    receive do
      {pid, :data, :out, messages} ->
        String.split(messages, "\n")
        |> Enum.filter(fn(m) -> String.length(m) > 0 end)
        |> Enum.reduce(default_state, fn(message, state) -> handle_message(message, state) end)
        |> loop(%Proc{pid: pid})
    end
  end

  defp loop(state, proc) do
    receive do
      {:status, caller} ->
        send caller, {:status, state}
        loop(state, proc)
      {:playback, playback} ->
        playback(state, proc, playback)
        |> loop(proc)
      {:load, path} ->
        Proc.send_input(proc, "LOAD #{path}\n")
        loop(state, proc)
      {:seek, percent, caller} ->
        seek(state, proc, percent, caller)
        |> loop(proc)
      {:quit} ->
        Proc.send_input(proc, "QUIT\n")
        loop(state, proc)
      {pid, :data, :out, messages} ->
        String.split(messages, "\n")
        |> Enum.filter(fn(m) -> String.length(m) > 0 end)
        |> Enum.reduce(state, fn(message, state) -> handle_message(message, state) end)
        |> loop(proc)
    end
  end

  defp playback(state, proc, playback) do
    cond do
      playback == true && state[:current_status] == "paused" ->
        Proc.send_input(proc, "PAUSE\n")
      playback == false && state[:current_status] == "playing" ->
        Proc.send_input(proc, "PAUSE\n")
      true ->
        # No track loaded
    end
    state
  end

  defp seek(state, proc, percent, caller) do
    if state[:current_status] != "stopped" do
      target_duration = round(state[:duration] * percent)
      Proc.send_input(proc, "JUMP #{target_duration / 1000}s\n") # Seconds

      send caller, {:ok, state[:duration]}
      %{state | start_time: DateUtil.now - target_duration}
    else
      send caller, {:err, "No Track"}
      state
    end
  end

  defp handle_message(message, state) do
    case message do
      "@R " <> version ->
        state
      "@I ID3:" <> metadata ->
        state
      "@I " <> metadata ->
        state
      "@S " <> status ->
        state
      "@F " <> status ->
        [rem_durr, curr_durr] = String.split(status)
          |> Enum.reverse
          |> Enum.take(2)
          |> Enum.map(fn a -> String.to_float(a) end)

        if 0 == curr_durr do
          %{state |
            duration: rem_durr * 1000,
            start_time: DateUtil.now
          }
        else
          state
        end
      "@P " <> status ->
        current_status = case status do
          "0" ->
            if state[:status] != "stopped" do
              GrooveLion.Player.next_track(true)
            end
            "stopped"
          "1" -> "paused"
          "2" -> "playing"
        end
        %{state | current_status: current_status}
      "@E " <> error ->
        state
      _ ->
        state
    end
  end
end
