defmodule SummerSinger.Queue do
  alias SummerSinger.{Track, Repo}
  require Logger

  def start_link(initial_queue) do
    Agent.start_link(fn ->
      %{
        queue: initial_queue,
        queue_history: [],
        queue_index: 0,
        repeat: true,
        shuffle: true
      } end, name: __MODULE__)
  end

  def queue do
    queue = Agent.get(__MODULE__, &(Map.get(&1, :queue)))

    tracks = queue |> Enum.with_index |> Enum.map(fn {track_id, index} ->
      Repo.get(Track, track_id) |> Repo.preload(:artist) |> Track.to_map(index)
    end)

    %{queue: tracks}
  end

  def status do
    Agent.get(__MODULE__, fn state ->
      Map.take(state, [:queue_index, :repeat, :shuffle])
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
      history = [{index, track_id}] ++ state[:queue_history]
      new_state = %{state | queue_index: index, queue_history: history}
      {track_id, new_state}
    end)
  end

  def previous_track do
    state = Agent.get(__MODULE__, &(&1))

    case state[:queue_history] do
      [{index, _track_id} | history] ->
        # TODO: Check if expected track still exists
        Agent.update(__MODULE__, fn state ->
          %{state | queue_history: history, queue_index: index }
        end)
        {:ok, Enum.at(state[:queue], index)}
      [] ->
        :none
    end
  end

  def next_track_old do
    state = Agent.get_and_update(__MODULE__, fn state ->
      state = cond do
        state[:queue_index] && (state[:queue_index] + 1 < Enum.count(state[:queue])) ->
          track_id = Enum.at(state[:queue], state[:queue_index] + 1)
          history = ([{track_id, state[:queue_index] + 1}] ++ state[:queue_history])
          %{state |
            queue_index: state[:queue_index] + 1,
            queue_history: history
          }
        state[:repeat] ->
          track_id = Enum.at(state[:queue], 0)
          history = ([{track_id, state[:queue_index] + 1}] ++ state[:queue_history])
          %{state |
            queue_index: 0,
            queue_history: history
          }
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

  def next_track do
    state = Agent.get(__MODULE__, &(&1))

    next_index = state[:queue]
      |> repeat_filter_tracks(state[:queue_history], state[:repeat])
      |> select_next_track(state[:queue_index], length(state[:queue]), state[:repeat], state[:shuffle])

    case next_index do
      {:ok, index} ->
        {:ok, track(index)}
      :none -> :none
    end
  end

  defp repeat_filter_tracks(queue, history, repeat \\ false) do
    if repeat do
      queue
    else
      queue -- Enum.map(history, &(elem(&1, 0)) )
    end
  end

  defp select_next_track(queue, queue_index, queue_length, repeat \\ false, shuffle \\ false) do
    cond do
      shuffle ->
        {:ok, Enum.random(1..queue_length) - 1}
      queue_index + 1 < queue_length  ->
        {:ok, queue_index + 1}
      repeat ->
        {:ok, 0}
      true ->
        :none
    end
  end
end
