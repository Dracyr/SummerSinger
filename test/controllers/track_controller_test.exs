defmodule GrooveLion.TrackControllerTest do
  use GrooveLion.ConnCase

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

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, track_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    track = Repo.insert! %Track{}
    conn = get conn, track_path(conn, :show, track)
    assert json_response(conn, 200)["data"] == %{
      "id" => track.id,
      "title" => track.title,
      "artist" => track.artist,
      "filename" => track.filename
    }
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_raise Ecto.NoResultsError, fn ->
      get conn, track_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, track_path(conn, :create), track: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Track, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, track_path(conn, :create), track: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    track = Repo.insert! %Track{}
    conn = put conn, track_path(conn, :update, track), track: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Track, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    track = Repo.insert! %Track{}
    conn = put conn, track_path(conn, :update, track), track: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    track = Repo.insert! %Track{}
    conn = delete conn, track_path(conn, :delete, track)
    assert response(conn, 204)
    refute Repo.get(Track, track.id)
  end
end
