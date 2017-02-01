defmodule SummerSinger.IndexMusic do
  require Logger
  alias SummerSinger.{Repo, Folder, Playlist, Library, Track, Album, CoverArt}
  import Ecto.Query, only: [from: 2]
  require IEx

  def run(path) do
    path = String.rstrip path, ?/
    Logger.info("Searching for tracks in: " <> path)
    library = Library.find_or_create!(path)

    #find_tracks(path, library, true)

    Logger.info("Added all tracks, searching for playlists")
    #find_playlists(path)

    Logger.info("Playlists added, adding coverart")
    add_coverart()
  end

  def find_tracks(path, library, root \\ false) do
    # Add folder
    if is_nil Repo.get_by Folder, path: path do
      Folder.create!(path, library, root)
    end

    # Add tracks
    path
    |> Path.join("/*.{mp3,flac,wav,mp4,m4a}")
    |> Path.wildcard
    |> SummerSinger.IndexMusic.Supervisor.add_tracks

    # Continue for directories
    path
    |> File.ls!
    |> Enum.map(&Path.join(path, &1))
    |> Enum.filter(&File.dir?/1)
    |> Enum.each(&find_tracks(&1, library))
  end

  def find_playlists(path) do
    path
    |> Path.join("**/*.{m3u}")
    |> Path.wildcard()
    |> Stream.filter(&(is_nil(Repo.get_by(Playlist, path: &1))))
    |> Stream.each(&Playlist.create(&1, path))
    |> Stream.run
  end

  def add_coverart() do
    query = from t in Track,
      where: is_nil(t.cover_art_id),
      preload: [:album]

    Repo.all(query)
    |> Enum.each(&add_coverart/1)
  end

  defp add_coverart(track) do
    if !is_nil(track.album) && !is_nil(track.album.cover_art_id) do
      Track.changeset(track, %{cover_art_id: track.album.cover_art_id})
      |> Repo.update
    else
      case MetadataParser.fetch_cover(track.filename) do
        {:ok, cover} ->
          ext = case cover.mime_type do
            "image/jpeg" -> "jpg"
            "image/jpg" -> "jpg" # This isnt according to spec
            "image/png" -> "png"
            _ -> ""
          end

          res = CoverArt.changeset(%CoverArt{}, %{
            mime_type: cover.mime_type,
            description: cover.description,
            picture_type: cover.picture_type,
          }) |> Repo.insert

          case res do
            {:ok, cover_art} ->

              CoverArt.changeset(cover_art, %{
                cover_art: %{filename: "cover.#{ext}", binary: cover.image}
              }) |> Repo.update!

              Track.changeset(track, %{cover_art_id: cover_art.id})
              |> Repo.update!

              if track.album do
                Album.changeset(track.album, %{cover_art_id: cover_art.id})
                |> Repo.update!
              end
            _ -> nil
          end
        _ ->
          nil
      end
    end
  end

end
