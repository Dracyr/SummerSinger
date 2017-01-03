defmodule SummerSinger.IndexMusic do
  require Logger
  alias SummerSinger.{Repo, Folder, Playlist, Library}

  def run(path) do
    path = String.rstrip path, ?/
    Logger.info("Searching for tracks in: " <> path)
    library = Library.find_or_create!(path)

    find_tracks(path, library, true)

    Logger.info("Added all tracks, searching for playlists")
    find_playlists(path)
  end

  def find_tracks(path, library, root \\ false) do
    # Add folder
    if is_nil Repo.get_by Folder, path: path do
      Folder.create!(path, library, root)
    end

    # Add tracks
    path
    |> Path.join("/*.{mp3,flac,wav,mp4,m4a}")
    |> Path.wildcard
    |> SummerSinger.IndexMusic.Supervisor.add_tracks

    # Continue for directories
    path
    |> File.ls!
    |> Enum.map(&Path.join(path, &1))
    |> Enum.filter(&File.dir?/1)
    |> Enum.each(&find_tracks(&1, library))
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
