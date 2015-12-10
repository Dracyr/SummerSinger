defmodule GrooveLion.Player do
  alias GrooveLion.Track
  alias GrooveLion.Repo

  @doc """
  Frontend
    paused ->
      current_duration = paused_duration
    playing ->
      current_duration = now - start_time

  Backend
    play_track ->
      start_time = now

    pause ->
      paused_duration = now - start_time

    play ->
      start_time = now - paused_duration


    seek ->
      target = duration * percent

      start_time = now - target
      paused_duration = target


  """
  def start_link do
    Agent.start_link(fn ->
      %{
        queue: [],
        queue_index: nil,
        playback: false,
        start_time: nil,
        paused_duration: 0,
      } end, name: __MODULE__)
  end

  def get_status do
    Agent.get(__MODULE__, fn state ->
      %{
        playback: state[:playback],
        start_time: state[:start_time],
        paused_duration: state[:paused_duration],
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
      if is_nil(state[:queue_index]) do
        state
      else
        case playback do
          true ->
            %{state |
              playback: playback,
              start_time: DateUtil.now - state[:paused_duration]
            }
          false ->
            %{state |
              playback: playback,
              paused_duration: DateUtil.now - state[:start_time]
            }
        end
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
        paused_duration: 0,
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

  def next_track(backend_next \\ false) do
    {count, queue_index} = Agent.get(__MODULE__, fn state ->
      {Enum.count(state[:queue]), state[:queue_index]}
    end)

    if is_number(queue_index) && (queue_index + 1 < count) do
      play_track(queue_index + 1)
      {:ok}
    else
      {:err}
    end

    if backend_next == true do
      GrooveLion.Endpoint.broadcast! "status:broadcast", "statusUpdate", get_status
    end
  end

  def seek(percent) do
    send :audio_player, {:seek, percent, self()}

    receive do
      {:ok, duration} ->
        Agent.update(__MODULE__, fn state ->
          target_duration = round(duration * percent)
          %{state |
            start_time: DateUtil.now - target_duration,
            paused_duration: target_duration
          }
        end)
      {:err, reason} ->
        # Fuck it
    end
  end
end
