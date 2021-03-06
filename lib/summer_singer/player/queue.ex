defmodule SummerSinger.Queue do
  alias SummerSinger.{Track, Repo}

  def start_link() do
    Agent.start_link(fn ->
      %{
        queue: [],
        queue_history: [],
        queue_index: nil,
        p_total: 0,
        shuffle: true
      } end, name: __MODULE__)
  end

  def queue do
    tracks =
      Agent.get(__MODULE__, &(Map.get(&1, :queue)))
      |> Enum.with_index
      |> Enum.map(fn {{track_id, _prop}, index} ->
        Repo.get(Track, track_id) |> Repo.preload([:artist, :album]) |> Track.to_map(index)
      end)

    %{queue: tracks}
  end

  def status do
    Agent.get(__MODULE__, fn state ->
      Map.take(state, [:queue_index, :repeat, :shuffle])
    end)
  end

  def queue_track(track_id) do
    queue_tracks([track_id])
  end

  def queue_tracks(track_list) when is_list(track_list) and length(track_list) > 0 do
    Agent.get_and_update(__MODULE__, fn state ->
      track_count = Enum.count(state[:queue]) + Enum.count(track_list)
      track_list = Enum.map(track_list, fn t -> {t, track_count} end)
      new_queue = Enum.map(state[:queue], fn {t, prop} ->
        {t, prop + Enum.count(track_list)}
      end) ++ track_list
      p_total = Enum.reduce(new_queue, 0, fn ({_t, prop}, acc) -> prop + acc end)

      new_state = %{state |
        queue: new_queue,
        p_total: p_total
      }
      {Enum.count(state[:queue]), new_state}
    end)
  end
  def queue_tracks(_), do: nil

  def track(index) do
    Agent.get_and_update(__MODULE__, fn state ->
      {track_id, _prop} = Enum.fetch!(state[:queue], index)

      new_queue = Enum.map(state[:queue], fn {t, prop} -> {t, prop + 1} end)
      |> List.replace_at(index, {track_id, 0})

      p_total = Enum.reduce(new_queue, 0, fn ({_t, prop}, acc) -> prop + acc end)
      new_state = %{state |
        queue: new_queue,
        p_total: p_total,
        queue_index: index,
        queue_history: [{index, track_id}] ++ state[:queue_history]
      }
      {track_id, new_state}
    end)
  end

  def previous_track do
    state = Agent.get(__MODULE__, &(&1))

    case state[:queue_history] do
      [{index, _track_id} | history] ->
        Agent.update(__MODULE__, fn state ->
          %{state | queue_history: history, queue_index: index}
        end)
        {:ok, Enum.at(state[:queue], index) |> elem(0)}
      [] ->
        :none
    end
  end

  def next_track do
    state = Agent.get(__MODULE__, &(&1))
    if state[:shuffle] do
      p_target = state[:p_total] * :rand.uniform
      next_index = Enum.reduce_while(state[:queue], {0, 0}, fn {_t, prop}, {i, prop_acc} ->
        if prop + prop_acc >= p_target do
          {:halt, {i, prop + prop_acc}}
        else
          {:cont, {i + 1, prop + prop_acc}}
        end
      end) |> elem(0)

      {:ok, track(next_index)}
    else
      queue_index = state[:queue_index] || 0
      queue_length = Enum.count(state[:queue])

      if queue_index + 1 < queue_length do
        {:ok, queue_index + 1}
      else
        :none
      end
    end
  end

  def remove_track(queue_index) do
    Agent.update(__MODULE__, fn state ->
      history = decrement_history_index(state[:queue_history], queue_index)
      queued_tracks = List.delete_at(state[:queue], queue_index)
      current_index = cond do
        queue_index < state[:queue_index] ->
          state[:queue_index] - 1
        queue_index == state[:queue_index] ->
          nil
        true ->
          state[:queue_index]
      end

      %{state |
        queue: queued_tracks,
        queue_history: history,
        queue_index: current_index
      }
    end)
  end

  def clear_queue do
    Agent.update(__MODULE__, fn state ->
      %{state |
        queue: [],
        queue_history: [],
        queue_index: nil,
        p_total: 0,
      }
    end)
  end

  defp decrement_history_index(history, queue_index) do
    Enum.reject(history, fn {index, _track_id} -> index == queue_index end)
    |> Enum.map(fn {index, track_id} ->
      index = if queue_index < index, do: index - 1, else: index
      {index, track_id}
    end)
  end
end
