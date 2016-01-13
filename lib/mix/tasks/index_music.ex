defmodule Mix.Tasks.GrooveLion.IndexMusic do
  use Mix.Task

  alias GrooveLion.Repo
  alias GrooveLion.Track
  alias GrooveLion.Artist
  alias GrooveLion.Album

  def run(_args) do
    # Mix.Task.run "app.start", []
    find_files("/home/dracyr/Music/")
    |> Stream.filter( &(!is_nil(Repo.get_by(Track, filename: &1))) )
    |> Stream.each(&add_file(&1))
    |> Stream.run
  end

  defp find_files(path) do
    path
    |> Path.join("**/*.{mp3}")
    |> Path.wildcard()
  end

  defp add_file(file) do
    {:ok, audio_data, metadata} = MetadataParser.parse(file)
    create_track(file, metadata, audio_data)
  end

  defp create_track file, metadata, audio_data do

    artist = Artist.find_or_create(metadata[:artist])
    album = Album.find_or_create(metadata[:album], artist)

    track = %Track{
      title: metadata[:title],
      artist_id: artist && artist.id,
      album_id: album && album.id,
      filename: file,
      duration: audio_data.duration,
      rating: metadata[:rating],
    }

    case Repo.insert(track) do
      {:ok, _track} ->
        IO.puts "Added: " <> file
      {:error, changeset} ->
        IO.puts "Error adding: " <> file
        IO.inspect(changeset.errors)
    end
  end
end
