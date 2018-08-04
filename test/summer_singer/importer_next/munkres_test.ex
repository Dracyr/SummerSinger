defmodule Importer.MunkresTest do
  use ExUnit.Case, async: true

  test "compute for simple matrix" do
    assert Munkres.compute([[1.0,2.0,3.0], [2.0,4.0,6.0], [3.0, 6.0, 9.0]]) == [{0, 2}, {1, 1}, {2, 0}]
  end

  test "compute for non-square matrix by rows" do
    assert Munkres.compute([[1.0,2.0,3.0], [2.0,4.0,6.0]]) == [{0, 1}, {1, 0}]
  end

  test "compute for simple matrix by cols" do
    assert Munkres.compute([[1.0,2.0], [2.0,4.0], [3.0, 6.0]]) == [{0, 1}, {1, 0}]
  end
end
