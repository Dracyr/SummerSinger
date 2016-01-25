defmodule GrooveLion.Queue do

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

  def get_queue do
    Agent.get(__MODULE__, fn state ->
      state[:queue]
    end)
  end

  def queue_track(track_id) do
    Agent.update(__MODULE__, fn state ->
      %{state | queue: (state[:queue] ++ [track_id])}
    end)
  end

  def previous_track do
    {queue, queue_index} = Agent.get(__MODULE__, fn state ->
      {state[:queue], state[:queue_index]}
    end)

    case queue_index do
      0 ->
        {:ok, queue[queue_index]}
      index when is_number(index) ->
        {:ok, queue[index - 1]}
      _ ->
        {:no_track_available}
    end
  end

  def next_track do
    state = Agent.update(__MODULE__, fn state ->
      cond do
        state[:queue_index] + 1 < Enum.count(state[:queue]) ->
          %{state | queue_index: state[:queue_index] + 1 }
        state[:repeat] ->
          %{state | queue_index: 0 }
        true ->
          %{state | queue_index: nil }
      end
    end)

    case state[:queue_index] do
      nil -> {:no_track_available}
      index -> {:ok, Enum.fetch!(state[:queue], index)}
    end
  end

  def play_track(index) do
    Agent.get_and_update(__MODULE__, fn state ->
      new_state = %{state | queue_index: index, queue_history: []}
      {Enum.fetch!(state[:queue], index), new_state}
    end)
  end
end
