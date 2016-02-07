defmodule GrooveLion.AudioPlayer do

  def start_link do
    {:ok, sup_pid} = Task.Supervisor.start_link(name: GrooveLion.AudioBackendSupervisor)

    {:ok, controller_pid} = Task.Supervisor.start_child(
      GrooveLion.AudioBackendSupervisor, fn -> start_loop() end)

    Process.register(controller_pid, :audio_player)

    {:ok, sup_pid}
  end

  defp start_loop() do
    default_state = %{
      current_status: "stopped",
      start_time: nil, # Epoch in milliseconds
      duration: nil # In Milliseconds
    }
    port = Port.open({:spawn, "mpg123 -R"}, [:use_stdio])

    loop(default_state, port)
  end

  defp loop(state, port) do
    receive do
      {:status, caller} ->
        send caller, {:status, state}
        loop(state, port)
      {:playback, playback} ->
        playback(state, port, playback)
        |> loop(port)
      {:load, path} ->
        Port.command(port, "LOAD #{path}\n")
        loop(state, port)
      {:seek, percent} ->
        seek(state, port, percent)
        |> loop(port)
      {:quit} ->
        Port.command(port, "QUIT\n")
        loop(state, port)
      {^port, {:data, messages}} ->
        messages = to_string(messages)
        String.split(messages, "\n")
        |> Enum.filter(fn(m) -> String.length(m) > 0 end)
        |> Enum.reduce(state, fn(message, state) -> handle_message(message, state) end)
        |> loop(port)
    end
  end

  defp playback(state, port, playback) do
    cond do
      playback == true && state[:current_status] == "paused" ->
        Port.command(port, "PAUSE\n")
      playback == false && state[:current_status] == "playing" ->
        Port.command(port, "PAUSE\n")
      true ->
        IO.inspect("No track is loaded")
    end
    state
  end

  defp seek(state, port, percent) do
    if state[:current_status] != "stopped" do
      target_duration = state[:duration] * percent
      Port.command(port, "JUMP #{target_duration / 1000}s\n") # Seconds
      %{state | start_time: DateUtil.now - target_duration}
    else
      state
    end
  end

  defp handle_message(message, state) do
    case message do
      "@R " <> _version ->
        state
      "@I ID3:" <> _metadata ->
        state
      "@I " <> _metadata ->
        state
      "@S " <> _status ->
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
      "@E " <> _error ->
        state
      _ ->
        state
    end
  end
end
