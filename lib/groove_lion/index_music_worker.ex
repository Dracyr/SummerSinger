defmodule SummerSinger.IndexMusic.Worker do
  use GenServer
  alias SummerSinger.{Repo, Track, Artist, Album, Folder}

  def start_link(state) do
    :gen_server.start_link(__MODULE__, state, [])
  end

  def init(state) do
    {:ok, state}
  end

  def handle_call(track_path, _from, state) do
    if is_nil(Repo.get_by(Track, filename: track_path)) do
      add_track(track_path)
    end
    {:reply, track_path, state}
  end

  def add_track(pid, track_path) do
    :gen_server.call(pid, track_path, :infinity)
  end

  defp add_track(track_path) do
    # TODO: Elixir 1.3, 'with'
    case MetadataParser.parse(track_path) do
      {:ok, audio_data, metadata} ->
        case create_track(track_path, metadata, audio_data) do
          {:ok, track} ->
            case Repo.insert(track) do
              {:ok, _track} ->
                IO.inspect("** ADDED: " <> track_path)
              {:error, reason} ->
                IO.inspect("[ERROR] " <> track_path <> " " <> reason)
            end
          {:error, reason} ->
            IO.inspect("WE FUCKED UP " <> reason)
            raise "WE FUCKED UP"
        end
      {:error, _reason} ->
        IO.inspect("Error, could not add track: " <> track_path)
    end
  end

  defp create_track(track_path, metadata, audio_data) do
    artist = Artist.find_or_create(metadata[:artist])
    album = Album.find_or_create(metadata[:album], artist)
    folder = Repo.get_by(Folder, path: Path.dirname(track_path))

    track = %Track{
      title: metadata[:title],
      artist_id: artist && artist.id,
      album_id: album && album.id,
      filename: track_path,
      duration: audio_data.duration,
      rating: metadata[:rating] || 0,
      folder_id: folder.id
    }

    {:ok, track}
  end
end
