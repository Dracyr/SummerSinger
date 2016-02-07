defmodule SummerSinger.AlbumTest do
  use SummerSinger.ModelCase

  alias SummerSinger.Album

  @valid_attrs %{
    title: "The Fame",
    year: "2009"
  }

  @invalid_attrs %{
    title: nil,
    year: "2009"
  }

  test "changeset with valid attributes" do
    changeset = Album.changeset(%Album{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Album.changeset(%Album{}, @invalid_attrs)
    refute changeset.valid?
  end
end
