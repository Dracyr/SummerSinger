defmodule SummerSinger.AlbumControllerTest do
  use SummerSinger.Web.ConnCase

  alias SummerSinger.Album
  @valid_attrs %{title: "some content", year: "some content"}
  @invalid_attrs %{}

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, album_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    album = Repo.insert! %Album{}
    conn = get conn, album_path(conn, :show, album)
    assert json_response(conn, 200)["data"] == %{"id" => album.id,
      "title" => album.title,
      "year" => album.year}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_raise Ecto.NoResultsError, fn ->
      get conn, album_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, album_path(conn, :create), album: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Album, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, album_path(conn, :create), album: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    album = Repo.insert! %Album{}
    conn = put conn, album_path(conn, :update, album), album: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Album, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    album = Repo.insert! %Album{}
    conn = put conn, album_path(conn, :update, album), album: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    album = Repo.insert! %Album{}
    conn = delete conn, album_path(conn, :delete, album)
    assert response(conn, 204)
    refute Repo.get(Album, album.id)
  end
end
