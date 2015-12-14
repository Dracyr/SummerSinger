defmodule GrooveLion.PlaylistControllerTest do
  use GrooveLion.ConnCase

  alias GrooveLion.Playlist
  @valid_attrs %{title: "some content"}
  @invalid_attrs %{}

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, playlist_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    playlist = Repo.insert! %Playlist{}
    conn = get conn, playlist_path(conn, :show, playlist)
    assert json_response(conn, 200)["data"] == %{"id" => playlist.id,
      "title" => playlist.title}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_raise Ecto.NoResultsError, fn ->
      get conn, playlist_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, playlist_path(conn, :create), playlist: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Playlist, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, playlist_path(conn, :create), playlist: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    playlist = Repo.insert! %Playlist{}
    conn = put conn, playlist_path(conn, :update, playlist), playlist: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Playlist, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    playlist = Repo.insert! %Playlist{}
    conn = put conn, playlist_path(conn, :update, playlist), playlist: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    playlist = Repo.insert! %Playlist{}
    conn = delete conn, playlist_path(conn, :delete, playlist)
    assert response(conn, 204)
    refute Repo.get(Playlist, playlist.id)
  end
end
