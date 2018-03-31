defmodule SummerSinger.Importer.Index do
  alias SummerSinger.{Repo, Folder, Track}
  require Logger

  defmodule SummerSinger.Importer.Index.Folder do
    defstruct path: nil, sub_dirs: [], tracks: []

    def to_changesets(dir, library_id) do
      folder = Folder.changeset(%Folder{}, %{
        path: dir.path,
        title: Path.basename(dir.path),
        library_id: library_id
      })

      [folder] ++ Enum.flat_map(dir.sub_dirs, &to_changesets(&1, library_id))
    end
  end
  alias SummerSinger.Importer.Index.Folder, as: IndexFolder


  def collect_dirs(path) do
    children = File.ls!(path)

    %IndexFolder{
      path: path,
      sub_dirs: filter_dirs(children, path),
      tracks: collect_tracks(children, path)
    }
  end

  def insert(library, root_dir) do
    {:ok, results} =
      root_dir
      |> IndexFolder.to_changesets(library.id)
      |> Repo.multi_changesets(on_conflict: :replace_all, conflict_target: :path)

    folder_ids = Map.new(results, fn {_, fldr} -> {fldr.path, {fldr.id, fldr}} end)
    {folders, tracks} = collect_updates(root_dir, folder_ids, nil)

    Logger.info("Inserting, found #{length(folders)} folders, #{length(tracks)} tracks")
    Repo.multi_changesets(folders)
    Repo.multi_changesets(tracks, on_conflict: :nothing)

    nil
  end

  defp filter_dirs(children, path) do
    children
    |> Enum.map(&Path.expand(&1, path))
    |> Enum.filter(&File.dir?/1)
    |> Enum.map(&collect_dirs/1)
    |> Enum.filter(&(length(&1.tracks) > 0 || length(&1.sub_dirs) > 0))
  end

  @valid_exts [".mp3", ".flac"]
  defp collect_tracks(children, path) do
    children
    |> Enum.filter(&Enum.member?(@valid_exts, Path.extname(&1)))
    |> Enum.map(&Path.expand(&1, path))
  end

  defp collect_updates(dir, folder_ids, parent_id) do
    {my_id, cset} = folder_ids[dir.path]

    changeset =
      if parent_id && is_nil(cset.parent_id) do
        cset
        |> Folder.changeset(%{parent_id: parent_id})
        |> Map.put(:action, :update)
        |> List.wrap
      else
        []
      end

    tracks = dir.tracks
      |> Enum.map(fn track ->
        Track.changeset(%Track{}, %{
          path: track,
          folder_id: my_id,
          duration: 0,
        })
      end)

    {sub_dirs, child_tracks} = dir.sub_dirs
      |> Enum.map(&collect_updates(&1, folder_ids, my_id))
      |> Enum.reduce({[], []}, fn {ds, ts}, {ads, ats} ->
        {ds ++ ads, ts ++ ats}
      end)

    {changeset ++ sub_dirs, tracks ++ child_tracks}
  end
end
