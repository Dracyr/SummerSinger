defmodule GrooveLion.Player do
  alias GrooveLion.Track
  alias GrooveLion.Repo

  def start_link do
    Agent.start_link(fn ->
      %{
        queue: [],
        queue_index: nil,
        playback: false,
        startTime: nil
      } end, name: __MODULE__)
  end

  def get_status do
    Agent.get(__MODULE__, fn state ->
      %{
        playback: state[:playback],
        startTime: state[:startTime],
        queue_index: state[:queue_index],
      }
    end)
  end

  def get_queue do
    Agent.get(__MODULE__, fn state ->
      tracks = Enum.with_index(state[:queue]) |> Enum.map(fn {track_id, index} ->
        Repo.get(Track, track_id) |> Track.to_map(index)
      end)
      %{queue: tracks}
    end)
  end

  def playback(playback) do
    send :audio_player, {:playback, playback}
    Agent.update(__MODULE__, fn state ->
      %{state | playback: playback}
    end)
  end

  def queue_track(track_id) do
    Agent.update(__MODULE__, fn state ->
      %{state | queue: (state[:queue] ++ [track_id])}
    end)
  end

  def play_track(queue_id) do
    track_id = Agent.get(__MODULE__, fn state ->
      Enum.fetch!(state[:queue], queue_id)
    end)
    track = Repo.get(Track, track_id)
    send :audio_player, {:load, track.filename}

    Agent.update(__MODULE__, fn state ->
      %{state | playback: true, queue_index: queue_id}
    end)
  end
end
