defmodule GrooveLion.Queue do
  alias GrooveLion.Track
  alias GrooveLion.Repo
  alias GrooveLion.Queue
  require Logger

  def start_link(initial_queue) do
    Agent.start_link(fn ->
      %{
        queue: initial_queue,
        queue_history: [],
        queue_index: 0,
        repeat: false,
        shuffle: false
      } end, name: __MODULE__)
  end

  def queue do
    queue = Agent.get(__MODULE__, &(Map.get(&1, :queue)))

    tracks = queue |> Enum.with_index() |> Enum.map(fn {track_id, index} ->
      Repo.get(Track, track_id) |> Repo.preload(:artist) |> Track.to_map(index)
    end)

    %{queue: tracks}
  end

  def status do
    Agent.get(__MODULE__, fn state ->
      Map.take(state, [:queue_index, :repeat, :shuffle, :queue_history])
    end)
  end

  def queue_track(track_id) do
    Agent.update(__MODULE__, fn state ->
      %{state | queue: (state[:queue] ++ [track_id])}
    end)
  end

  def track(index) do
    Agent.get_and_update(__MODULE__, fn state ->
      track_id = Enum.fetch!(state[:queue], index)
      new_state = %{state | queue_index: index, queue_history: ([[index, track_id]] ++ state[:queue_history])}
      {track_id, new_state}
    end)
  end

  def previous_track do
    state = Agent.get(__MODULE__, &(&1))

    case state[:queue_history] do
      [[index, track_id] | history] ->
        Agent.update(__MODULE__, fn state ->
          %{state | queue_history: history, queue_index: index }
        end)
        {:ok, Enum.at(state[:queue], index)}
      [] ->
        :none
    end
  end

  def next_track do
    state = Agent.get_and_update(__MODULE__, fn state ->
      state = cond do
        state[:queue_index] && (state[:queue_index] + 1 < Enum.count(state[:queue])) ->
          track_id = Enum.at(state[:queue], state[:queue_index] + 1)
          %{state |
            queue_index: state[:queue_index] + 1,
            queue_history: ([[state[:queue_index] + 1, track_id]] ++ state[:queue_history])
          }
        state[:repeat] ->
          track_id = Enum.at(state[:queue], 0)
          %{state | queue_index: 0, queue_history: ([[state[:queue_index] + 1, track_id]] ++ state[:queue_history]) }
        true ->
          %{state | queue_index: nil }
      end
      {state, state}
    end)

    case state[:queue_index] do
      nil -> :none
      index ->
        {:ok, Enum.at(state[:queue], index, :none)}
    end
  end
end
