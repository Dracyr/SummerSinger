defmodule SummerSinger.Importer do

  def import_path(path) do
    library = SummerSinger.Library.find_or_create!(path)

    scan_library(library)
  end

  def rescan() do
    SummerSinger.Library
    |> SummerSinger.Repo.all
    |> Enum.each(&scan_library/1)
  end

  defp scan_library(library) do
    # SummerSinger.Importer.Index.perform(library)
    SummerSinger.Importer.Metadata.perform()
    SummerSinger.Importer.Playlists.perform(library.path)
  end
end
