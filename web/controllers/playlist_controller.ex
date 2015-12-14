defmodule GrooveLion.PlaylistController do
  use GrooveLion.Web, :controller

  alias GrooveLion.Playlist

  plug :scrub_params, "playlist" when action in [:create, :update]

  def index(conn, _params) do
    playlists = Repo.all(Playlist)
    render(conn, "index.json", playlists: playlists)
  end

  def create(conn, %{"playlist" => playlist_params}) do
    changeset = Playlist.changeset(%Playlist{}, playlist_params)

    case Repo.insert(changeset) do
      {:ok, playlist} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", playlist_path(conn, :show, playlist))
        |> render("show.json", playlist: playlist)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(GrooveLion.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    playlist = Repo.get!(Playlist, id)
    render(conn, "show.json", playlist: playlist)
  end

  def update(conn, %{"id" => id, "playlist" => playlist_params}) do
    playlist = Repo.get!(Playlist, id)
    changeset = Playlist.changeset(playlist, playlist_params)

    case Repo.update(changeset) do
      {:ok, playlist} ->
        render(conn, "show.json", playlist: playlist)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(GrooveLion.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    playlist = Repo.get!(Playlist, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(playlist)

    send_resp(conn, :no_content, "")
  end
end
