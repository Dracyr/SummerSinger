defmodule SummerSinger.FolderControllerTest do
  use SummerSinger.ConnCase

  alias SummerSinger.Folder
  @valid_attrs %{path: "some content", title: "some content"}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, folder_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    folder = Repo.insert! %Folder{}
    conn = get conn, folder_path(conn, :show, folder)
    assert json_response(conn, 200)["data"] == %{"id" => folder.id,
      "path" => folder.path,
      "title" => folder.title}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, folder_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, folder_path(conn, :create), folder: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Folder, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, folder_path(conn, :create), folder: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    folder = Repo.insert! %Folder{}
    conn = put conn, folder_path(conn, :update, folder), folder: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Folder, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    folder = Repo.insert! %Folder{}
    conn = put conn, folder_path(conn, :update, folder), folder: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    folder = Repo.insert! %Folder{}
    conn = delete conn, folder_path(conn, :delete, folder)
    assert response(conn, 204)
    refute Repo.get(Folder, folder.id)
  end
end
