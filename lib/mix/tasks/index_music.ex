defmodule Mix.Tasks.SummerSinger.IndexMusic do
  import Ecto.Query
  use Mix.Task
  alias SummerSinger.{Repo, Track, Artist, Album, Playlist}

  def run([path | _args]) do
    Mix.Task.run "app.start", []
    find_tracks(path)
    |> Stream.filter(&(is_nil(Repo.get_by(Track, filename: &1))))
    |> Stream.each(&add_track(&1))
    |> Stream.run

    path
    |> Path.join("**/*.{m3u}")
    |> Path.wildcard()
    |> Stream.each(&Playlist.create(&1, path))
    |> Stream.run
  end

   @doc """
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
  defp filter_existing_tracks(track_paths) do
    track_paths
  end

  defp find_tracks(path) do
    path
    |> Path.join("**/*.{mp3}")
    |> Path.wildcard()
  end

  defp add_track(track_path) do
    IO.inspect("Adding '" <> track_path <> "'")
    {:ok, audio_data, metadata} = MetadataParser.parse(track_path)
    create_track(track_path, metadata, audio_data)
  end

  defp create_track(track_path, metadata, audio_data) do
    artist = Artist.find_or_create(metadata[:artist])
    album = Album.find_or_create(metadata[:album], artist)

    track = %Track{
      title: metadata[:title],
      artist_id: artist && artist.id,
      album_id: album && album.id,
      filename: track_path,
      duration: audio_data.duration,
      rating: metadata[:rating],
    }

    case Repo.insert(track) do
      {:ok, _track} ->
        IO.puts "Added: " <> track_path
      {:error, changeset} ->
        IO.puts "Error adding: " <> track_path
        IO.inspect(changeset.errors)
    end
  end
end
