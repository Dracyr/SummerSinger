defmodule GrooveLion.FindMusicFiles do
  alias GrooveLion.Repo
  alias GrooveLion.Track
  alias GrooveLion.Artist
  alias GrooveLion.Album

  def add_files do
    find_files("/home/dracyr/Music/AMFI 2015-05")
    |> Stream.each(&add_file(&1)) |> Stream.run
  end

  def find_files(path) do
    path
    |> Path.join("**/*.{mp3}")
    |> Path.wildcard()
  end

  defp add_file(file) do
    track = Repo.get_by(Track, filename: file)
    binary_file = File.read!(file)
    {:ok, metadata} =  ID3v2Parser.parse_binary(binary_file)
    {:ok, mpeg_data} = MPEGParser.parse_binary(binary_file)

    case is_nil(track) do
      true  -> create_track(file, metadata, mpeg_data)
      false -> update_track(track, metadata, mpeg_data)
    end
  end

  defp create_track file, metadata, mpeg_data do
    artist = find_or_create_artist(metadata["Artist"])
    album = find_or_create_album(metadata["Album"], metadata["Artist"])

    track = %Track{
      title: metadata["Title"],
      artist_id: artist && artist.id,
      album_id: album && album.id,
      filename: file,
      duration: round(mpeg_data.duration * 1000)
    }

    case Repo.insert(track) do
      {:ok, _track} ->
        IO.puts "Added: " <> file
      {:error, _changeset} ->
        IO.puts "Error adding: " <> file
    end
  end

  defp update_track track, metadata, mpeg_data do
    artist = find_or_create_artist(metadata["Artist"])
    album = find_or_create_album(metadata["Album"], metadata["Artist"])

    changeset = Track.changeset(track, %{
        title: metadata["Title"],
        artist_id: artist && artist.id,
        album_id: album && album.id,
        duration: round(mpeg_data.duration * 1000)
      })

    case Repo.update(changeset) do
      {:ok, _track} ->
        IO.puts "Updated: " <> track.filename
      {:error, _changeset} ->
        IO.puts "Error updating: " <> track.filename
    end
  end

  defp find_or_create_artist(nil), do: nil
  defp find_or_create_artist(artist_name) do
    case Repo.get_by(Artist, name: artist_name) do
      nil ->
        %Artist{name: artist_name} |> Repo.insert!
      artist -> artist
    end
  end

  defp find_or_create_album(nil, _), do: nil
  defp find_or_create_album(album_name, artist_name) do
    case Repo.get_by(Album, title: album_name) do
      nil ->
        %Album{title: album_name, artist_id: find_or_create_artist(artist_name).id}
        |> Repo.insert!
      album -> album
    end
  end

end
