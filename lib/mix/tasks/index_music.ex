defmodule Mix.Tasks.SummerSinger.IndexMusic do
  import Ecto.Query
  use Mix.Task
  alias SummerSinger.{Repo, Playlist}

  def run([path | _args]) do
    Mix.Task.run "app.start", []
    find_tracks(path)
    |> SummerSinger.IndexMusicSupervisor.add_tracks

    IO.inspect("Added all tracks, searching for playlists")

    path
    |> Path.join("**/*.{m3u}")
    |> Path.wildcard()
    |> Stream.filter(&(is_nil(Repo.get_by(Playlist, path: &1))))
    |> Stream.each(&Playlist.create(&1, path))
    |> Stream.run
  end

   @filter_existing_tracks """
      SELECT test_items.filename
          FROM (VALUES ('asd'), ('qwe'), ('/home/dracyr/Music/Osorterat/Atlas Genius/Atlas Genius - Back Seat.mp3'))
            AS test_items(filename)
          LEFT OUTER JOIN tracks
            ON tracks.filename = test_items.filename
            WHERE tracks.filename IS NULL;

      SELECT test_items.filename
      FROM tracks
      RIGHT OUTER JOIN (
        VALUES ('asd'), ('qwe'), ('/home/dracyr/Music/Osorterat/Atlas Genius/Atlas Genius - Back Seat.mp3'))
        AS test_items(filename)
        ON tracks.filename = test_items.filename
        WHERE tracks.filename IS NULL;

   """

  defp find_tracks(path) do
    path
    |> Path.join("**/*.{mp3}")
    |> Path.wildcard()
  end
end
