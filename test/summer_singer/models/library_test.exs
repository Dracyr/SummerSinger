defmodule SummerSinger.LibraryTest do
  use SummerSinger.ModelCase

  alias SummerSinger.Library

  @valid_attrs %{path: "some content", title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Library.changeset(%Library{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Library.changeset(%Library{}, @invalid_attrs)
    refute changeset.valid?
  end
end
