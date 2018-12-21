defmodule Importer.ScannerTest do
  use ExUnit.Case, async: true

  alias Importer.Scanner

  @data_dir "test/summer_singer/importer_next/data/scanner_dirs/"

  test "Scans dir with track in it" do
    path = [File.cwd!(), @data_dir, "with_one_track"] |> Path.join()
    dirs = Scanner.scan_flat(path)

    assert dirs == [
             %{
               path: path,
               tracks: ["test.mp3"]
             }
           ]
  end

  test "Empty dir" do
    path = [File.cwd!(), @data_dir, "empty_dir"] |> Path.join()
    dirs = Scanner.scan_flat(path)
    assert dirs == []
  end

  test "Multiple subdirs, empty root" do
    path = [File.cwd!(), @data_dir, "two_subdirs"] |> Path.join()
    dirs = Scanner.scan_flat(path)

    assert dirs == [
             %{path: Path.join(path, "one"), tracks: ["one.mp3"]},
             %{path: Path.join(path, "two"), tracks: ["two.mp3"]}
           ]
  end

  test "Multiple subdirs, root has tracks" do
    path = [File.cwd!(), @data_dir, "two_subdirs_root_tracks"] |> Path.join()
    dirs = Scanner.scan_flat(path)

    assert dirs == [
             %{path: path, tracks: ["four.mp3", "three.mp3"]},
             %{path: Path.join(path, "one"), tracks: ["one.mp3"]},
             %{path: Path.join(path, "two"), tracks: ["two.mp3"]}
           ]
  end

  test "Multiple subdirs, only one has a track" do
    path = [File.cwd!(), @data_dir, "two_subdirs_one_empty"] |> Path.join()
    dirs = Scanner.scan_flat(path)

    assert dirs == [%{path: Path.join(path, "non_empty"), tracks: ["one.mp3"]}]
  end

  test "Deep folder structure with a track per folder" do
    path = [File.cwd!(), @data_dir, "deep_single_dir_tracks"] |> Path.join()
    dirs = Scanner.scan_flat(path)

    assert dirs == [
             %{path: path, tracks: ["one.mp3"]},
             %{path: Path.join([path, "one", "two"]), tracks: ["two.mp3"]},
             %{path: Path.join([path, "one", "two", "three"]), tracks: ["three.mp3"]}
           ]
  end

  test "Only includes tracks with correct extensions" do
    path = [File.cwd!(), @data_dir, "with_filtered_files"] |> Path.join()
    dirs = Scanner.scan_flat(path)

    tracks = Enum.at(dirs, 0) |> Map.get(:tracks)
    valid_tracks = ["test.mp3", "test.flac"]

    for track <- valid_tracks do
      assert track in tracks
    end
  end

  test "is_disc_dir should work for common formats" do
    valid_disc_dirs = [
      "/test/cd 1",
      "/test/disc 2",
      "/test/disk 42",
      "/test/CD_4"
    ]

    for dir <- valid_disc_dirs do
      assert Scanner.is_disc_dir(%{path: dir})
    end
  end

  test "Album with disc dirs should fold the tracks up into the album" do
    path = [File.cwd!(), @data_dir, "with_album_dirs"] |> Path.join()
    dirs = Scanner.scan_flat(path)

    assert dirs == [
             %{
               path: path,
               tracks: [
                 Path.join("cd 2", "two.mp3"),
                 Path.join("cd 1", "one.mp3")
               ]
             }
           ]
  end

  test "Album with disc dirs should also include root files" do
    path = [File.cwd!(), @data_dir, "with_album_dirs_and_root"] |> Path.join()
    dirs = Scanner.scan_flat(path)

    assert dirs == [
             %{
               path: path,
               tracks: ["three.mp3", Path.join("cd 2", "two.mp3"), Path.join("cd 1", "one.mp3")]
             }
           ]
  end
end
