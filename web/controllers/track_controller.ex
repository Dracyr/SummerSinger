defmodule GrooveLion.TrackController do
  use GrooveLion.Web, :controller

  alias GrooveLion.Track

  plug :scrub_params, "track" when action in [:create, :update]

  def index(conn, _params) do
    tracks = Repo.all(Track) |> Repo.preload(:artist)
    render(conn, "index.json", tracks: tracks)
  end

  def create(conn, %{"track" => track_params}) do
    changeset = Track.changeset(%Track{}, track_params)

    case Repo.insert(changeset) do
      {:ok, track} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", track_path(conn, :show, track))
        |> render("show.json", track: track)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(GrooveLion.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    track = Repo.get!(Track, id)
    render(conn, "show.json", track: track)
  end

  def update(conn, %{"id" => id, "track" => track_params}) do
    track = Repo.get!(Track, id)
    changeset = Track.changeset(track, track_params)

    case Repo.update(changeset) do
      {:ok, track} ->
        render(conn, "show.json", track: track)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(GrooveLion.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    track = Repo.get!(Track, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(track)

    send_resp(conn, :no_content, "")
  end
end
