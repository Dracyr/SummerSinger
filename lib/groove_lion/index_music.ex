defmodule SummerSinger.IndexMusic do
  alias SummerSinger.{Repo, Playlist, Folder}

  def run(path) do
    path = String.rstrip path, ?/
    IO.inspect("Searching for tracks in: " <> path)
    find_tracks(path, true)

    IO.inspect("Added all tracks, searching for playlists")
    find_playlists(path)
  end

  def find_tracks(path, root \\ false) do
    # Add folder
    if is_nil Repo.get_by Folder, path: path do
      Folder.create!(path, root)
    end

    # Add tracks
    path
    |> Path.join("/*.{mp3}")
    |> Path.wildcard
    |> SummerSinger.IndexMusic.Supervisor.add_tracks

    # Continue for directories
    File.ls!(path)
    |> Enum.map(&Path.join(path, &1))
    |> Enum.filter(&File.dir?/1)
    |> Enum.each(&find_tracks/1)
  end

  def find_playlists(path) do
    path
    |> Path.join("**/*.{m3u}")
    |> Path.wildcard()
    |> Stream.filter(&(is_nil(Repo.get_by(Playlist, path: &1))))
    |> Stream.each(&Playlist.create(&1, path))
    |> Stream.run
  end
end
