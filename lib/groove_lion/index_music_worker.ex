defmodule SummerSinger.IndexMusicWorker do
  use GenServer
  alias SummerSinger.{Repo, Track, Artist, Album, Playlist}

  def start_link(state) do
    :gen_server.start_link(__MODULE__, state, [])
  end

  def init(state) do
    {:ok, state}
  end

  def handle_call(data, from, state) do
    if is_nil(Repo.get_by(Track, filename: data, log: false)) do
      add_track(data)
    end
    {:reply, data, state}
  end

  def add_track(pid, track_path) do
    :gen_server.call(pid, track_path)
  end

  defp add_track(track_path) do
    Repo.transaction fn ->
      IO.inspect("Adding '" <> track_path <> "'")
      case MetadataParser.parse(track_path) do
        {:ok, audio_data, metadata} ->
          create_track(track_path, metadata, audio_data)
        {:err, _reason} ->
          IO.inspect("Error, could not add track: " <> track_path)
      end
    end
  end

  defp get_artist_and_album(artist_name, album_name) do
    try do
      artist = Artist.find_or_create(artist_name)
      album = Album.find_or_create(album_name, artist)
      {artist, album}
    rescue
      # Rescue race conditions where artist already exists
      # TODO: this better
      e in RuntimeError ->
        {artist, album} = get_artist_and_album(artist_name, album_name)
    end
  end

  defp create_track(track_path, metadata, audio_data) do
    {artist, album} = get_artist_and_album(metadata[:artist], metadata[:album])

    track = %Track{
      title: metadata[:title],
      artist_id: artist && artist.id,
      album_id: album && album.id,
      filename: track_path,
      duration: audio_data.duration,
      rating: metadata[:rating],
    }

    case Repo.insert(track, log: false) do
      {:ok, _track} ->
        IO.puts "Added: " <> track_path
      {:error, changeset} ->
        IO.puts "Error adding: " <> track_path
        IO.inspect(changeset.errors)
    end
  end
end
