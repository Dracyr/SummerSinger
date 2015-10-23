defmodule GrooveLion.Queue do
  def start_link do
    Agent.start_link(fn -> %{queue: []} end, name: __MODULE__)
  end

  def get_tracks do
    Agent.get(__MODULE__, fn queue ->
      Enum.with_index(queue[:queue]) |> Enum.map(fn {track_id, index} ->
        GrooveLion.Repo.get(GrooveLion.Track, track_id)
        |> GrooveLion.Track.to_map(index)
      end)
    end)
  end

  def add_track(track_id) do
    IO.inspect(track_id)
    Agent.update(__MODULE__, fn queue ->
      %{queue: (queue[:queue] ++ [track_id])}
    end)
  end
end
