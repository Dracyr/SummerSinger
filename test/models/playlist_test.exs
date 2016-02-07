defmodule SummerSinger.PlaylistTest do
  use SummerSinger.ModelCase

  alias SummerSinger.Playlist

  @valid_attrs %{title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Playlist.changeset(%Playlist{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Playlist.changeset(%Playlist{}, @invalid_attrs)
    refute changeset.valid?
  end
end
