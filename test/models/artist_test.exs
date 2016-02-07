defmodule SummerSinger.ArtistTest do
  use SummerSinger.ModelCase

  alias SummerSinger.Artist

  @valid_attrs %{
    name: "Lady Gaga",
  }

  @invalid_attrs %{
    name: nil
  }

  test "changeset with valid attributes" do
    changeset = Artist.changeset(%Artist{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Artist.changeset(%Artist{}, @invalid_attrs)
    refute changeset.valid?
  end
end
