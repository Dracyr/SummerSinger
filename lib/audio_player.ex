defmodule GrooveLion.AudioPlayer do
  alias Porcelain.Process, as: Proc
  require Logger

  def start_link do
    default = %{
      current_status: 'stopped',
      start_time: nil, # Epoch in milliseconds
      duration: nil # In Milliseconds
    }

    {:ok, tpid} = Task.start_link(fn -> await_proc(default) end)
    Process.register(tpid, :audio_player)

    proc = %Proc{pid: pid} =
      Porcelain.spawn_shell("mpg123 -R", in: :receive, out: {:send, tpid})

    send tpid, {:set_proc, proc}
    Process.register(pid, :procelain_audio)
    {:ok, tpid}
  end

  defp await_proc(state) do
    receive do
      {:set_proc, proc} ->
        IO.inspect(proc)
        IO.inspect("\n\n asdASd \n\n")

        loop(state, proc)
    end
  end

  defp loop(state, proc) do
    receive do
      {:status, caller} ->
        send caller, {:status, state}
        loop(state, proc)
      {:playback, playback} ->
        playback(playback, state[:current_status])
        loop(state, proc)
      {:load, path} ->
        send_input("LOAD #{path}\n")
        loop(state, proc)
      {:seek, percent, caller} ->
        if is_nil(state[:start_time]) do
          send caller, {:err, "No Track"}
          loop(state, proc)
        else
          start_time = seek(percent, state[:duration], state[:start_time])
          send caller, {:ok, start_time, state[:duration]}
          loop(%{state | start_time: start_time}, proc)
        end
      {:quit} ->
        send_input("QUIT\n")
        loop(state, proc)
      {pid, :data, :out, messages} ->
        String.split(messages, "\n")
        |> Enum.filter(fn(m) -> String.length(m) > 0 end)
        |> Enum.reduce(state, fn(message, state) -> handle_message(message, state) end)
        |> loop(proc)
    end
  end

  defp playback(playback, status) do
    cond do
      playback == true && status == "paused" ->
        send_input("PAUSE\n")
      playback == false && status == "playing" ->
        send_input("PAUSE\n")
      true ->
        # No track loaded
    end
  end

  defp seek(percent, duration, start_time) do
    current_duration = DateUtil.now - start_time
    diff = (duration * percent) - current_duration
    send_input("JUMP #{diff / 1000}\n") # Seconds

    start_time + diff
  end

  defp handle_message(message, state) do
    case message do
      "@R " <> version ->
        Logger.debug "Loaded player: " <> version
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
          IO.inspect("it is zero")
          %{state |
            duration: rem_durr * 1000,
            start_time: DateUtil.now
          }
        else
          state
        end
      "@P " <> status ->
        current_status = case status do
          "0" -> "stopped"
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

  defp send_input(message) do
    pid = Process.whereis(:procelain_audio)
    unless is_nil(pid) do
      Proc.send_input(%Proc{pid: pid}, message)
    end
  end
end
