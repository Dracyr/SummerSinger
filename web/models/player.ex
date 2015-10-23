defmodule GrooveLion.Player do
  alias GrooveLion.Track
  alias GrooveLion.Repo
  alias GrooveLion.CurrentStatus

  def start_link do
    Agent.start_link(fn -> %{queue: [], queue_index: 0} end, name: __MODULE__)
  end

  def get_queue do
    Agent.get(__MODULE__, fn queue ->
      tracks = Enum.with_index(queue[:queue]) |> Enum.map(fn {track_id, index} ->
        GrooveLion.Repo.get(GrooveLion.Track, track_id)
        |> GrooveLion.Track.to_map(index)
      end)

      %{queue: tracks, queue_index: queue[:queue_index]}
    end)
  end


  def queue_track(track_id) do
    Agent.update(__MODULE__, fn queue ->
      %{queue: (queue[:queue] ++ [track_id])}
    end)
  end

  def play_track(queue_id) do
    IO.inspect(queue_id)
    track_id = Agent.get(__MODULE__, fn queue ->
      Enum.fetch!(queue[:queue], queue_id)
    end)
    IO.inspect(track_id)
    track = Repo.get(Track, track_id)
    send :audio_player, {:load, track.filename}
    CurrentStatus.set_status(%{playback: true, current_track: queue_id})
  end

  def playback(playback) do
    send :audio_player, {:playback, playback}
    CurrentStatus.set_status(%{playback: playback})
  end
end
