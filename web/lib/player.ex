defmodule SummerSinger.Player do
  @moduledoc ~S"""
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
  alias SummerSinger.{Track, Repo, Queue}

  def start_link do
    Agent.start_link(fn ->
      %{
        playback: false,
        start_time: nil,
        paused_duration: 0,
        volume: 100,
      } end, name: __MODULE__)
  end

  def status do
    Agent.get(__MODULE__, fn state ->
      %{
        playback: state[:playback],
        start_time: state[:start_time],
        paused_duration: state[:paused_duration],
        volume: state[:volume],
      }
    end) |> Map.merge(Queue.status)
  end

  def playback(playback) do
    queue_index = Queue.status()[:queue_index]
    if queue_index do
      send :audio_player, {:playback, playback}
    else
      next_track()
    end


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
    result = case Queue.next_track do
      {:ok, track_id} ->
        play_track(track_id)
        broadcast_status = status |> Map.merge(%{current_time: DateUtil.now})
        if backend_next, do: SummerSinger.Endpoint.broadcast! "status:broadcast", "statusUpdate", broadcast_status
        :ok
      :none ->
        :err
    end

    result
  end

  def seek(percent) do
    send :audio_player, {:seek, percent}

    current_track_id = Queue.status |> Map.fetch!(:queue_index) |> Queue.track
    track = Repo.get!(Track, current_track_id)
    target_duration = (track.duration * 1000) * percent

    Agent.update(__MODULE__, fn state ->
      %{state |
        start_time: DateUtil.now - target_duration,
        paused_duration: target_duration
      }
    end)
  end

  def volume(percent) do
    send :audio_player, {:volume, percent}

    Agent.update(__MODULE__, fn state ->
      %{state | volume: percent }
    end)
  end
end
