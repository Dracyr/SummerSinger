defmodule Importer.Scanner do
  alias Importer.Scanner.Directory
  @valid_exts [".mp3", ".flac"]

  def scan!(path) do
    # flat_dirs =
    #   dir
    #   |> flatten_dirs
    #   |> Enum.filter(&(!Enum.empty?(&1.tracks)))

    scan_path(path)
  end

  defp scan_path(path) do
    children = File.ls!(path)

    %{
      path: path,
      sub_directories: filter_dirs(children, path),
      tracks: filter_tracks(children, path)
    }
  end

  defp filter_dirs(children, path) do
    children
    |> Enum.map(&Path.expand(&1, path))
    |> Enum.filter(&File.dir?(&1))
    |> Enum.map(&scan_path(&1))
    |> Enum.filter(&(length(&1.tracks) > 0 || length(&1.sub_directories) > 0))
  end

  defp filter_tracks(children, path) do
    Enum.flat_map(children, fn child ->
      case Enum.member?(@valid_exts, Path.extname(child)) do
        true -> [Path.expand(child, path)]
        _ -> []
      end
    end)
  end

  defp flatten_dirs(dir) do
    [%{path: dir.path, tracks: dir.tracks ++ fold_tracks(dir)}] ++
      Enum.flat_map(dir.sub_directories, &flatten_dirs/1)
  end

  defp fold_tracks(dir) do
    Enum.flat_map(dir.sub_directories, fn d ->
      case Regex.match?(~r/^(.*((dis[ck])|(cd))[\W_]*)\d+/i, Path.basename(d.path)) do
        true -> dir.tracks
        false -> []
      end
    end)
  end
end
