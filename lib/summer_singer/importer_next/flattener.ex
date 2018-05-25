defmodule Importer.Flattener do
  alias SummerSinger.{Repo, Folder, Track}
  import Ecto.Query

  def fetch_stuff do
    root_dir = Repo.one from f in Folder, where: f.path == "/home/dracyr/Music/"

    collect_dir(root_dir)
    |> flatten_dirs
    |> Enum.filter(&(!Enum.empty?(&1.tracks)))
  end

  def collect_dir(dir) do
    sub_dirs = Repo.all from f in Folder, where: f.parent_id == ^dir.id
    tracks = Repo.all from t in Track, where: t.folder_id == ^dir.id, select: t.path

    %{
      path: dir.path,
      tracks: tracks,
      sub_directories: Enum.map(sub_dirs, &collect_dir/1)
    }
  end

  defp flatten_dirs(dir) do
    [%{path: dir.path, tracks: dir.tracks ++ fold_tracks(dir)}] ++
      Enum.flat_map(dir.sub_directories, &flatten_dirs/1)
  end

  # Folds albums in on themselves so that albums with multiple discs are counted as one album
  defp fold_tracks(dir) do
    Enum.flat_map(dir.sub_directories, fn d ->
      case Regex.match?(~r/^(.*((dis[ck])|(cd))[\W_]*)\d+/i, Path.basename(d.path)) do
        true -> dir.tracks
        false -> []
      end
    end)
  end
end
