defmodule SummerSinger.Importer do
  alias SummerSinger.Importer.{Index, Metadata, Playlists}

  def import_path(path) do
    library = SummerSinger.Library.find_or_create!(path)

    scan_library(library)
  end

  def rescan() do
    SummerSinger.Library
    |> SummerSinger.Repo.all()
    |> Enum.each(&scan_library/1)
  end

  defp scan_library(library) do
    root_dir = Index.collect_dirs(library.path)
    Index.insert(library, root_dir)

    Metadata.perform()
    Playlists.perform(library.path)
  end
end
