defmodule GrooveLion.FindMusicFiles do
  alias GrooveLion.Repo
  alias GrooveLion.Track

  def add_files do
    find_files("/home/dracyr/Music/AMFI 2015-05")
    |> Enum.each(fn(file) -> add_file(file) end)
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
    track = %Track{
      title: metadata["Title"],
      artist: metadata["Artist"],
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
    changeset = Track.changeset(track, %{
        title: metadata["Title"],
        artist: metadata["Artist"],
        metadata: metadata,
        duration: round(mpeg_data.duration * 1000)
      })

    case Repo.update(changeset) do
      {:ok, _track} ->
        IO.puts "Updated: " <> track.filename
      {:error, _changeset} ->
        IO.puts "Error updating: " <> track.filename
    end
  end
end
