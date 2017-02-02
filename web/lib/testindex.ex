defmodule Importer do
  alias SummerSinger.{Repo, Library, Folder}
  use GenStage

  def start_link(root_folder) do
    GenStage.start_link(Importer, root_folder, name: Importer)
  end

  def init(root_folder) do
    library = Library.find_or_create!(root_folder)
    {:producer, {[], [root_folder], library}}
  end

  def handle_demand(demand, state) when demand > 0 do
    IO.inspect("Demand Importer")
    {track_list, folder_list, library} = fill_lists(state, demand)
    {events, track_list} = Enum.split(track_list, demand)
    {:noreply, events, {track_list, folder_list, library}}
  end

  defp fill_lists({track_list, folder_list, library}, demand)
      when length(track_list) >= demand or length(folder_list) == 0,
    do: {track_list, folder_list, library}

  defp fill_lists({track_list, folder_list, library}, demand) do
    [folder | folder_list] = folder_list

    tracks = folder
    |> Path.join("/*.{mp3,flac,wav,mp4,m4a}")
    |> Path.wildcard

    track_list = track_list ++ tracks

    folders = folder
    |> File.ls!
    |> Enum.map(&Path.join(folder, &1))
    |> Enum.filter(&File.dir?/1)

    folder_list = folders ++ folder_list

    # Create folder
    #if length(tracks) > 0 || length(folders) > 0 do
    #  if is_nil Repo.get_by(Folder, path: folder) do
    #    Folder.create!(folder, library, (folder == library.path))
    #  end
    #end

    if length(track_list) >= demand do
      {track_list, folder_list, library}
    else
      fill_lists({track_list, folder_list, library}, demand)
    end
  end
end

defmodule Importer.FilterExisting do
  alias SummerSinger.Repo
  use GenStage
  import Ecto.Query, only: [from: 2]

  def start_link() do
    GenStage.start_link(Importer.FilterExisting, :ok, name: Importer.FilterExisting)
  end

  def init(:ok) do
    {:producer_consumer, :the_state_does_not_matter, subscribe_to: [{Importer, min_demand: 10, max_demand: 1000}]}
  end

  def handle_events(events, _from, state) do
    IO.inspect("Events existing")
    events = Enum.filter(events, fn track_path ->
      res = Repo.all(from t in "tracks", where: t.filename == ^track_path, select: t.id)
      length(res) == 0
    end)
    {:noreply, events, state}
  end
end

defmodule Importer.Metadata do
  use GenStage

  def start_link() do
    GenStage.start_link(Importer.Metadata, :ok, name: Importer.Metadata)
  end

  def init(:ok) do
    {:producer_consumer, 0, subscribe_to: [{Importer.FilterExisting, min_demand: 10, max_demand: 1000}]}
  end

  def handle_events(events, _from, state) do
    IO.inspect("Events PARSING")
    events = Enum.map(events, &parse_track(&1))
    |> Enum.filter(fn result ->
      case result do
        {:error, _} -> false
        _ -> true
      end
    end)
    {:noreply, events, state + length(events) }
  end

  defp parse_track(track_path) do
    with  {:ok, audio_data, metadata} <- MetadataParser.fetch_tags(track_path),
      do: {track_path, audio_data, metadata}
  end
end

defmodule Importer.Updater do
  use GenStage
  alias SummerSinger.{Repo, Track, Artist, Album, Folder}
  require IEx


  def start_link() do
    GenStage.start_link(Importer.Updater, {[], [], []}, name: Importer.Updater)
  end

  def init(state) do
    {:producer_consumer, state, subscribe_to: [{Importer.Metadata, min_demand: 10, max_demand: 1000}]}
  end

  def handle_events(events, _from, state) do
    IO.inspect("Events UPDATING")
    {events, state} = Enum.map_reduce(events, state, &track_changeset(&1, &2))
    # Repo.insert_all(Track, events)
    multi = Ecto.Multi.new
    Enum.reduce(events, multi, fn track, multi ->
      Ecto.Multi.insert(multi, track.filename, track)
    end)
    |> Repo.transaction

    {:noreply, events, state}
  end

  defp get_artist(artists, nil), do: {artists, nil}
  defp get_artist(artists, artist) do
    case Enum.find(artists, & &1.name == artist) do
      nil ->
        artist = Artist.find_or_create(artist)
        {artists ++ [artist], artist}
      artist ->
        {artists, artist}
    end
  end

  defp get_album(albums, title, artist)
    when is_nil(title) or is_nil(artist), do: {albums, nil}
  defp get_album(albums, album_title, artist) do
    case Enum.find(albums, fn {album, album_artist} -> album.title == album_title && album_artist.name == artist.name end) do
      nil ->
        album = Album.find_or_create(album_title, artist)
        {albums ++ [{album, artist}], album}
      {album, album_artist} ->
        {albums, album}
    end
  end

  defp get_folder(folders, track_path) do
    case Enum.find(folders, & &1.path == track_path) do
      nil ->
        folder = Repo.get_by(Folder, path: Path.dirname(track_path))
        {folders ++ [folder], folder}
      folder ->
        {folders, folder}
    end
  end

  defp track_changeset({track_path, audio_data, metadata}, {artists, albums, folders}) do
    # artist = Artist.find_or_create(metadata["ARTIST"])
    {artists, artist} = get_artist(artists, metadata["ARTIST"])

    {artists, album_artist} =
      if metadata["ALBUM"] do
        get_artist(artists, metadata["ALBUMARTIST"])
      else
        {artists, nil}
      end

    {albums, album} = get_album(albums, metadata["ALBUM"], album_artist || artist)
    {folders, folder} = get_folder(folders, track_path)

    rating =
      if metadata["RATING"] do
        if is_integer(metadata["RATING"]),
          do: metadata["RATING"],
          else: String.to_integer(metadata["RATING"])
      else
        0
      end

    track = %Track{
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
    }

    {track, {artists, albums, folders}}
  end
end



defmodule Importer.Final do
  use GenStage

  def start_link() do
    GenStage.start_link(Importer.Final, :ok, name: Importer.Final)
  end

  def init(:ok) do
    {:consumer, :the_state_does_not_matter, subscribe_to: [{Importer, min_demand: 10, max_demand: 1000}]}
  end

  def handle_events(events, _from, state) do
    # Inspect the events.
    #IO.inspect(events)
    Enum.each(events, &IO.inspect(&1))

    # We are a consumer, so we would never emit items.
    {:noreply, [], state}
  end
end


