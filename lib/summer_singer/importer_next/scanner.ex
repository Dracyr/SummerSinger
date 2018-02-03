defmodule Importer.Scanner.Directory do
  defstruct path: nil, sub_directories: [], tracks: []
end

defmodule Importer.Scanner do
  alias Importer.Scanner.Directory
  @valid_exts [".mp3", ".flac"]

  def scan_dir!(path) do
    children = File.ls!(path)

    %Directory{
      path: path,
      sub_directories: filter_dirs(children, path),
      tracks: filter_tracks(children, path)
    }
  end

  defp filter_dirs(children, path) do
    children
    |> Enum.map(&Path.expand(&1, path))
    |> Enum.filter(&File.dir?(&1))
    |> Enum.map(&scan_dir!(&1))
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
end
