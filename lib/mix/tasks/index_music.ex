defmodule Mix.Tasks.SummerSinger.IndexMusic do
  use Mix.Task
  alias SummerSinger.{Repo, Playlist}

  def run([path | _args]) do
    Mix.Task.run "app.start", []

    find_tracks(path)
    IO.inspect("Added all tracks, searching for playlists")

    path
    |> Path.join("**/*.{m3u}")
    |> Path.wildcard()
    |> Stream.filter(&(is_nil(Repo.get_by(Playlist, path: &1))))
    |> Stream.each(&Playlist.create(&1, path))
    |> Stream.run
  end

  defp find_tracks(path) do
    tracks = path
    |> Path.join("/*.{mp3}")
    |> Path.wildcard
    |> SummerSinger.IndexMusicSupervisor.add_tracks

    dirs = File.ls!(path)
    |> Enum.map(&Path.join(path, &1))
    |> Enum.filter(&File.dir?/1)
    |> Enum.each(&find_tracks/1)
  end
end
