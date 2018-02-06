defmodule SummerSinger.Exper do
  alias SummerSinger.{Repo, Library, Track, Folder}
  import Ecto.Query

  defmodule SummerSinger.Exper.Folder do
    defstruct path: nil, tracks: []
  end
  alias SummerSinger.Exper.Folder, as: ExperFolder


  def do_stuff do
    library = Repo.get(Library, 1)
    root_dir = Repo.one(from f in Folder, where: f.id == 1, preload: :tracks)
    # require IEx;IEx.pry
    # Så det vi ska göra nu
    # Börja från toppen
    # Gå igenom mapparna
    # Slå ihop CD1, CD1 osv

    # I slutändan vill vi ha en lista, med alla "mappar" och dess tracks
    find_folders(root_dir)
  end

  def find_folders(dir) do
    children = Repo.all(from f in Folder,
      where: f.parent_id == ^dir.id,
      preload: :tracks
    )

    is_collection =
      children
      |> Enum.map(&Path.basename(&1.path))
      |> Enum.all?(&matches_collection/1)

    if is_collection && Enum.empty?(dir.tracks) do
      disc_tracks = Enum.map(children, &(&1.tracks))
      [%ExperFolder{path: dir.path, tracks: disc_tracks}]
    else
      [%ExperFolder{path: dir.path, tracks: dir.tracks}] ++
        Enum.flat_map(children, &find_folders(&1))
    end
  end

  def matches_collection(nil), do: false
  def matches_collection(dir_name) do
    Regex.match?(~r/^(dis[ck][\W_]*\d)|(cd[\W_]*\d)/i, dir_name)
  end
end
