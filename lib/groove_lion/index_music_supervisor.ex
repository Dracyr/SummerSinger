defmodule SummerSinger.IndexMusic.Supervisor do
  use Supervisor

  def start_link do
    :supervisor.start_link(__MODULE__, [])
  end

  defp pool_name do
    :index_music_pool
  end

  def init([]) do
    repo_pool_size = Application.get_env(:summer_singer, SummerSinger.Repo)[:pool_size]

    pool_options = [
      name: {:local, pool_name()},
      worker_module: SummerSinger.IndexMusic.Worker,
      size: repo_pool_size,
      max_overflow: 0
    ]

    children = [
      :poolboy.child_spec(pool_name(), pool_options, [])
    ]

    supervise(children, strategy: :one_for_one)
  end

  def add_track(track_path) do
    pool_track(track_path)
  end

  def add_tracks(tracks) do
    tracks |> Enum.map(fn track ->
      Task.async(fn -> pool_track(track) end)
    end)
    |> Enum.map(&Task.await/1)
  end

  defp pool_track(track_path) do
    :poolboy.transaction(pool_name, fn(pid) ->
      SummerSinger.IndexMusic.Worker.add_track(pid, track_path)
    end, :infinity)
  end
end
