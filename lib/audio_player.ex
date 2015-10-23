defmodule GrooveLion.AudioPlayer do
  alias Porcelain.Process, as: Proc
  require Logger

  def start_link do
    default = %{
      current_status: 'stopped',
      current_frame: nil,
      frames: nil,
      current_duration: nil,
      duration: nil
    }

    {:ok, tpid} = Task.start_link(fn -> loop(default) end)
    Process.register(tpid, :audio_player)

    proc = %Proc{pid: pid} =
      Porcelain.spawn_shell("mpg123 -R", in: :receive, out: {:send, tpid})

    Process.register(pid, :procelain_audio)
    {:ok, tpid}
  end

  defp loop(map) do
    receive do
      {:status, caller} ->
        send caller, map
        loop(map)
      {:playback, playback} ->
        status = map[:current_status]
        cond do
          playback == true && status == "paused" ->
            send_input("PAUSE\n")
          playback == false && status == "playing" ->
            send_input("PAUSE\n")
          true ->
            # No track loaded
        end
        loop(map)
      {:load, path} ->
        send_input("LOAD #{path}\n")
        loop(map)
      {:jump, duration} ->
        send_input("JUMP +10\n")
        loop(map)
      {:quit} ->
        send_input("QUIT\n")
        loop(map)
      {pid, :data, :out, messages} ->
        String.split(messages, "\n")
        |> Enum.filter(fn(m) -> String.length(m) > 0 end)
        |> Enum.reduce(map, fn(message, map) -> handle_message(message, map) end)
        |> loop()
    end
  end

  defp handle_message(message, map) do
    case message do
      "@R " <> version ->
        Logger.debug "Loaded player: " <> version
        map
      "@I ID3:" <> metadata ->
        map
      "@I " <> metadata ->
        map
      "@S " <> status ->
        map
      "@F " <> status ->
        [curr_frame, rem_frame, curr_durr, rem_durr] = String.split(status)
        %{map |
          current_frame: String.to_integer(curr_frame),
          frames: String.to_integer(curr_frame) + String.to_integer(rem_frame),
          current_duration: String.to_float(curr_durr),
          duration: String.to_float(curr_durr) + String.to_float(rem_durr)
        }
      "@P " <> status ->
        current_status = case status do
          "0" -> "stopped"
          "1" -> "paused"
          "2" -> "playing"
        end
        %{map | current_status: current_status}
      "@E " <> error ->
        map
      _ ->
        map
    end
  end

  defp send_input(message) do
    pid = Process.whereis(:procelain_audio)
    unless is_nil(pid) do
      Proc.send_input(%Proc{pid: pid}, message)
    end
  end
end

# {:ok, apid} = GrooveLion.AudioPlayer.start_link
# send apid, {:load, "/home/dracyr/test.mp3"}
# send apid, {:play_pause}
