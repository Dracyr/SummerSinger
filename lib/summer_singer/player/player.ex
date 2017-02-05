defmodule SummerSinger.Player do
  use GenServer
  alias SummerSinger.{Track, Repo, Queue, BackendPlayer}

  def start_link do
    inital_state = %{
      playback: false,
      start_time: nil,
      paused_duration: 0,
      volume: 100,
    }
    GenServer.start_link(__MODULE__, inital_state, name: __MODULE__)
  end

  def status do
    GenServer.call(__MODULE__, :status)
  end

  def playback(playback) do
    GenServer.cast(__MODULE__, {:playback, playback})
  end

  def play_queued_track(queue_id) do
    Queue.track(queue_id)
    |> play_track()
  end

  def previous_track do
    case Queue.previous_track do
      {:ok, track_id} ->
        play_track(track_id)
        :ok
      _ ->
        :err
    end
  end

  def next_track(backend_next \\ false) do
    case Queue.next_track do
      {:ok, track_id} ->
        play_track(track_id)

        if backend_next do
          broadcast_status = Map.merge(status(), %{current_time: DateUtil.now})
          SummerSinger.Endpoint.broadcast! "status:broadcast", "statusUpdate", broadcast_status
        end

        :ok
      :none ->
        :err
    end
  end

  def volume(percent) do
    GenServer.cast(__MODULE__, {:volume, percent})
  end

  def seek(percent) do
    GenServer.cast(__MODULE__, {:seek, percent})
  end

  def play_track(track_id) do
    GenServer.cast(__MODULE__, {:play_track, track_id})
  end

  def handle_call(:status, _from, state) do
    {:reply, Map.merge(state, Queue.status), state}
  end

  def handle_cast({:playback, playback}, state) do
    queue_index = Queue.status()[:queue_index]
    if queue_index do
      BackendPlayer.playback(playback)

      new_state =
        if playback do
          start_time = DateUtil.now - state[:paused_duration]
          %{state | playback: playback, start_time: start_time}
        else
          paused_duration = DateUtil.now - state[:start_time]
          %{state | playback: playback, paused_duration: paused_duration }
        end

      {:noreply, new_state}
    else
      next_track()
      {:noreply, state}
    end
  end

  def handle_cast({:play_track, track_id}, state) do
    track = Repo.get!(Track, track_id)
    BackendPlayer.load(track.path)

    new_state =
      %{state |
        playback: true,
        start_time: DateUtil.now,
        paused_duration: 0
      }

    {:noreply, new_state}
  end

  def handle_cast({:seek, percent}, state) do
    BackendPlayer.seek(percent)

    current_track_id = Queue.status |> Map.fetch!(:queue_index) |> Queue.track
    track = Repo.get!(Track, current_track_id)
    target_duration = (track.duration * 1000) * percent

    {
      :noreply,
      %{state |
        start_time: DateUtil.now - target_duration,
        paused_duration: target_duration
      }
    }
  end

  def handle_cast({:volume, percent}, state) do
    BackendPlayer.volume(percent)

    {
      :noreply,
      %{state | volume: percent}
    }
  end
end
