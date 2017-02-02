defmodule Importer.Index do
  alias SummerSinger.{Repo, Folder, Track}
  require Logger

  defmodule Importer.Index.Folder do
    defstruct path: nil, children: [], tracks: []

    def to_changesets(dir, library_id) do
      folder = Folder.changeset(%Folder{}, %{
        path: dir.path,
        title: Path.basename(dir.path),
        library_id: library_id
      })

      [folder] ++ Enum.flat_map(dir.children, &to_changesets(&1, library_id))
    end
  end

  def perform(path) do
    Logger.info("Indexing " <> path)
    library = SummerSinger.Library.find_or_create!(path)
    root_dir = collect_dirs(path)

    {:ok, results} =
      root_dir
      |> Importer.Index.Folder.to_changesets(library.id)
      |> Repo.multi_changesets(on_conflict: :replace_all, conflict_target: :path)

    folder_ids = Map.new(results, fn {_, fldr} -> {fldr.path, {fldr.id, fldr}} end)
    {folders, tracks} = collect_updates(root_dir, folder_ids, nil)

    Logger.info("Inserting, found #{length(folders)} folders, #{length(tracks)} tracks")
    Repo.multi_changesets(folders, on_conflict: :replace_all, conflict_target: :path)
    Repo.multi_changesets(tracks, on_conflict: :nothing)

    nil
  end

  @valid_exts [".mp3", ".flac"]

  defp collect_dirs(path) do
    children = File.ls!(path)

    dirs = children
      |> Enum.map(&Path.expand(&1, path))
      |> Enum.filter_map(&File.dir?/1, &collect_dirs/1)
      |> Enum.filter(&(length(&1.tracks) > 0 || length(&1.children) > 0))

    tracks = Enum.filter_map(children,
        &Enum.member?(@valid_exts, Path.extname(&1)),
        &Path.expand(&1, path)
      )

    %Importer.Index.Folder{path: path, children: dirs, tracks: tracks}
  end

  defp collect_updates(dir, folder_ids, parent_id) do
    {my_id, cset} = folder_ids[dir.path]

    changeset =
      if parent_id && is_nil(cset.parent_id) do
        cset
        |> Repo.preload([:library, :parent, :children, :tracks])
        |> Folder.changeset(%{ parent_id: parent_id })
        |> List.wrap
      else
        []
      end

    tracks = dir.tracks
      |> Enum.map(fn track ->
        Track.changeset(%Track{}, %{
          filename: track,
          folder_id: my_id,
          duration: 0,
        })
      end)

    {children, child_tracks} = dir.children
      |> Enum.map(&collect_updates(&1, folder_ids, my_id))
      |> Enum.reduce({[], []}, fn {ds, ts}, {ads, ats} ->
        {ds ++ ads, ts ++ ats}
      end)

    {changeset ++ children, tracks ++ child_tracks}
  end
end
