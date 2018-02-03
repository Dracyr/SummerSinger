defmodule Importer.ScannerTest do
  use ExUnit.Case, async: true

  alias Importer.Scanner

  @data_dir "test/summer_singer/importer_next/data/scanner_dirs/"

  test "only includes tracks with the correct extensions" do
    path = File.cwd! |> Path.join(@data_dir)
    dir = Importer.Scanner.scan_dir!(path)

    actual_tracks = [
      path <> "/test.mp3",
      path <> "/test.flac"
    ]

    assert actual_tracks == dir.tracks
  end

  test "only subdirs with tracks are included" do
    path = File.cwd! |> Path.join(@data_dir)
    dir = Importer.Scanner.scan_dir!(path)

    [ sub_dir ] = dir.sub_directories

    actual_dir =
      File.cwd!
      |> Path.join(@data_dir)
      |> Path.join("with_tracks")

    assert sub_dir.path == actual_dir
  end

  test "includes path" do
    path = File.cwd! |> Path.join(@data_dir)
    dir = Importer.Scanner.scan_dir!(path)

    assert dir.path == path
  end
end
