defmodule GrooveLion.FindMusicFiles do
  alias GrooveLion.Repo
  alias GrooveLion.Track

  def add_files do
    find_files("/home/dracyr/Music")
    |> Enum.each(fn(file) ->
      if is_nil Repo.get_by(Track, filename: file) do
        {:ok, metadata} = File.read!(file) |> GrooveLion.ID3v2.parse()
        track = %Track{title: metadata.title, artist: metadata.artist, filename: file}

        case Repo.insert(track) do
          {:ok, _track} ->
            IO.puts "Added: " <> file
          {:error, changeset} ->
            IO.puts "Error adding: " <> file
        end
      end
    end)
  end

  def find_files(path) do
    path
    |> Path.join("**/*.{mp3}")
    |> Path.wildcard()
  end
end
