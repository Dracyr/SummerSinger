defmodule SummerSinger.LibraryControllerTest do
  use SummerSinger.Web.ConnCase

  alias SummerSinger.Library
  @valid_attrs %{path: "some content", title: "some content"}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, library_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    library = Repo.insert! %Library{}
    conn = get conn, library_path(conn, :show, library)
    assert json_response(conn, 200)["data"] == %{"id" => library.id,
      "path" => library.path,
      "title" => library.title}
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, library_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, library_path(conn, :create), library: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Library, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, library_path(conn, :create), library: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    library = Repo.insert! %Library{}
    conn = put conn, library_path(conn, :update, library), library: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Library, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    library = Repo.insert! %Library{}
    conn = put conn, library_path(conn, :update, library), library: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    library = Repo.insert! %Library{}
    conn = delete conn, library_path(conn, :delete, library)
    assert response(conn, 204)
    refute Repo.get(Library, library.id)
  end
end
