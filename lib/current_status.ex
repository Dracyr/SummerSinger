defmodule GrooveLion.CurrentStatus do
  def start_link do
    Agent.start_link(fn -> %{
      playback: false,
      current_track: nil,
      startTime: nil,
      hwPlayback: false,
      hwVolume: 1
      } end, name: __MODULE__)
  end

  def get_status do
    Agent.get(__MODULE__, fn status -> status end)
  end

  def set_playback(playback) do
    Agent.update(__MODULE__, fn status -> %{status | playback: !status[:playback]} end)
  end

  def set_status(new_status) do
    Agent.update(__MODULE__, fn status -> Map.merge(status, new_status) end)
  end
end
