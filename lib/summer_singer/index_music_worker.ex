defmodule SummerSinger.IndexMusic.Worker do
  use GenServer
  require Logger
  alias SummerSinger.{Repo, Track, Artist, Album, Folder}

  def start_link(state) do
    :gen_server.start_link(__MODULE__, state, [])
  end

  def init(state) do
    {:ok, state}
  end

  def handle_call(track_path, _from, state) do
    if is_nil(Repo.get_by(Track, filename: track_path)) do
      case add_track(track_path) do
        {:ok, track} ->
          Logger.info("ADDED TRACK: " <> track_path)
        {:error, reason} ->
          Logger.error("COULD NOT ADD TRACK: " <> track_path <> ", " <> reason)
      end
    end
    {:reply, track_path, state}
  end

  def add_track(pid, track_path) do
    :gen_server.call(pid, track_path, :infinity)
  end

  defp add_track(track_path) do
    with  {:ok, audio_data, metadata} <- MetadataParser.parse(track_path),
          {:ok, track} <- track_changeset(track_path, audio_data, metadata),
          {:ok, track} <- Repo.insert(track),
            do: {:ok, track}
  end

  defp track_changeset(track_path, audio_data, metadata) do
    artist = Artist.find_or_create(metadata["ARTIST"])

    album_artist =
      if metadata["ALBUM"] do
        Artist.find_or_create(metadata["ALBUMARTIST"])
      else
        nil
      end

    album = Album.find_or_create(metadata["ALBUM"], artist)
    folder = Repo.get_by(Folder, path: Path.dirname(track_path))

    rating =
      if metadata["RATING"] do
        if is_integer(metadata["RATING"]) do
          metadata["RATING"]
        else
          String.to_integer(metadata["RATING"])
        end
      else
        0
      end

    {:ok, %Track{
      title: metadata["TITLE"],
      artist_id: artist && artist.id,
      album_id: album && album.id,
      filename: track_path,
      duration: audio_data["duration"] / 1,
      rating: rating,
      folder_id: folder.id,
      metadata: %{
        audio_data: audio_data,
        tags: metadata,
      }
    }}
  end
end
