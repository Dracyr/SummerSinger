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
    binary_file = File.read!(file)

    {:ok, metadata}  = ID3v2Parser.parse_binary(binary_file)
    {:ok, mpeg_data} = MPEGParser.parse_binary(binary_file)

    create_track(file, metadata, mpeg_data)
  end

  defp create_track file, metadata, mpeg_data do
    artist = Artist.find_or_create(metadata["Artist"])
    album = Album.find_or_create(metadata["Album"], artist)

    track = %Track{
      title: metadata["Title"],
      artist_id: artist && artist.id,
      album_id: album && album.id,
      filename: file,
      duration: round(mpeg_data.duration)
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
