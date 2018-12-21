defmodule Importer.Scanner do
  alias Importer.Scanner.Directory
  @valid_exts [".mp3", ".flac"]

  def scan!(path) do
    scan_path(path)
  end

  def scan_flat(path) do
    path
    |> scan_path()
    |> flatten_dirs()
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
    |> Enum.filter(&((!is_nil(&1) && length(&1.tracks) > 0) || length(&1.sub_directories) > 0))
  end

  defp filter_tracks(children, path) do
    Enum.flat_map(children, fn child ->
      case Enum.member?(@valid_exts, Path.extname(child)) do
        true -> [child]
        _ -> []
      end
    end)
  end

  defp flatten_dirs(%{path: path, tracks: tracks, sub_directories: sub_directories} = dir) do
    folded_dir = %{path: path, tracks: tracks ++ fold_tracks(dir)}

    sub_dirs =
      sub_directories
      |> Enum.flat_map(&flatten_dirs/1)
      |> Enum.filter(&(!is_disc_dir(&1)))

    if length(folded_dir[:tracks]) > 0 do
      [folded_dir] ++ sub_dirs
    else
      sub_dirs
    end
  end

  def is_disc_dir(%{path: path}) do
    Regex.match?(~r/^(.*((dis[ck])|(cd))[\W_]*)\d+/i, Path.basename(path))
  end

  defp fold_tracks(%{sub_directories: sub_dirs, tracks: tracks}) do
    Enum.flat_map(sub_dirs, fn dir ->
      case is_disc_dir(dir) do
        true ->
          dir[:tracks]
          |> Enum.map(&Path.join(Path.basename(dir.path), &1))

        false ->
          []
      end
    end)
  end
end
