defmodule GrooveLion.Player do
  alias GrooveLion.Track
  alias GrooveLion.Repo
  alias GrooveLion.Queue
  require Logger

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
        playback: false,
        start_time: nil,
        paused_duration: 0,
      } end, name: __MODULE__)
  end

  def status do
    Agent.get(__MODULE__, fn state ->
      %{
        playback: state[:playback],
        start_time: state[:start_time],
        paused_duration: state[:paused_duration],
      }
    end) |> Map.merge(Queue.status)
  end

  def playback(playback) do
    send :audio_player, {:playback, playback}
    queue_index = Queue.status()[:queue_index]

    Agent.update(__MODULE__, fn state ->
      if is_nil(queue_index) do
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

  def play_queued_track(queue_id) do
    Queue.track(queue_id) |> play_track
  end

  def play_track(track_id) do
    track = Repo.get!(Track, track_id)
    Logger.debug(inspect(track))
    send :audio_player, {:load, track.filename}

    Agent.update(__MODULE__, fn state ->
      %{state |
        playback: true,
        start_time: DateUtil.now,
        paused_duration: 0
      }
    end)

    :ok
  end

  def previous_track do
    case Queue.previous_track do
      {:ok, track_id} ->
        play_track(track_id)
      _ -> :err
    end
  end

  def next_track(backend_next \\ false) do
    case Queue.next_track do
      {:ok, track_id} ->
        play_track(track_id)

        if backend_next == true do
          GrooveLion.Endpoint.broadcast! "status:broadcast", "statusUpdate", status
        end

        :ok
      :none ->
        if backend_next == true do
          GrooveLion.Endpoint.broadcast! "status:broadcast", "statusUpdate", status
        end

        :err
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
      _ -> :err
    end
  end
end
