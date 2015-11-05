defmodule GrooveLion.Player do
  alias GrooveLion.Track
  alias GrooveLion.Repo

  def start_link do
    Agent.start_link(fn ->
      %{
        queue: [],
        queue_index: nil,
        playback: false,
        start_time: nil,
        paused_time: nil
      } end, name: __MODULE__)
  end

  def get_status do
    send :audio_player, {:status, self()}

    duration = 0
    receive do
      {:status, state} ->
        duration = state[:duration]
    end

    Agent.get(__MODULE__, fn state ->

      %{
        playback: state[:playback],
        start_time: state[:start_time],
        paused_time: state[:paused_time],
        queue_index: state[:queue_index],
        duration: duration
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
      state = %{ state | playback: playback }
      cond do
        playback == true && !is_nil(state[:paused_time]) ->
          %{state |
            paused_time: nil,
            start_time: state[:start_time] + (DateUtil.now - state[:paused_time])
          }
        playback == false ->
          %{state | paused_time: DateUtil.now }
        true ->
          state
      end
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
      %{state |
        playback: true,
        start_time: DateUtil.now,
        paused_time: DateUtil.now,
        queue_index: queue_id,
      }
    end)
  end

  def previous_track do
    queue_index = Agent.get(__MODULE__, fn state -> state[:queue_index] end)
    case queue_index do
      0 ->
        play_track(queue_index)
        {:ok}
      _ when is_number(queue_index) ->
        play_track(queue_index - 1)
        {:ok}
      _ ->
        {:err}
    end
  end

  def next_track do
    {count, queue_index} = Agent.get(__MODULE__, fn state ->
      {Enum.count(state[:queue]), state[:queue_index]}
    end)

    if is_number(queue_index) && (queue_index + 1 < count) do
      play_track(queue_index + 1)
      {:ok}
    else
      {:err}
    end
  end

  def seek(percent) do
    send :audio_player, {:seek, percent}

    receive do
      {:ok, start_time, duration} ->
        IO.inspect(start_time)
        IO.inspect(duration)
      {:err, reason} ->
        # Fuck it
    end
  end
end
