defmodule GrooveLion.TrackTest do
  use GrooveLion.ModelCase

  alias GrooveLion.Track

  @valid_attrs %{
    title: "Somebody new",
    artist: "Joywave",
    filename: "Joywave - Somebody New.mp3",
    duration: 2000
  }
  @invalid_attrs %{
    title: nil,
    artist: nil,
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
end
