defmodule SummerSinger.Importer.Playlists do
  alias SummerSinger.{Repo, Playlist}

  def perform(path) do
    path
    |> Path.join("**/*.{m3u}")
    |> Path.wildcard()
    |> Stream.filter(&(is_nil(Repo.get_by(Playlist, path: &1))))
    |> Stream.each(&Playlist.create(&1, path))
    |> Stream.run
  end
end

