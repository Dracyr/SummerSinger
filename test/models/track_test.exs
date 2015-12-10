defmodule GrooveLion.TrackTest do
  use GrooveLion.ModelCase

  alias GrooveLion.Track

  @valid_attrs %{
    title: "Somebody new",
    filename: "Joywave - Somebody New.mp3",
    duration: 2000,
    rating: 255
  }
  @invalid_attrs %{
    title: nil,
    filename: nil,
    duration: nil
  }

  test "changeset with valid attributes" do
    changeset = Track.changeset(%Track{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Track.changeset(%Track{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "filename_exists? with existing file" do
    track = Repo.insert! struct(Track, @valid_attrs)
    assert Track.filename_exists?(track.filename)
  end

  test "filename_exists? with existing file" do
    assert Track.filename_exists?("Something else")
  end

  test "to_map/1" do
    track = struct(Track, @valid_attrs)
    assert Track.to_map(track) == %{
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration
    }
  end

  test "to_map/2" do
    track = struct(Track, @valid_attrs)
    assert Track.to_map(track, 3) == %{
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      index: 3
    }
  end
end
