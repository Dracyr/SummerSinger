defmodule SummerSinger.TrackController do
  use SummerSinger.Web, :controller
  import Ecto.Query

  alias SummerSinger.Track

  plug :scrub_params, "track" when action in [:create, :update]

  def index(conn, params) do
    IO.inspect(params)
    tracks = case params["search"] do
      nil ->
        tracks = limit_tracks(params["offset"], params["limit"])
      search_term ->
        tracks = Track.search(search_term)
    end |> Repo.preload(:artist)
    track_count = Repo.all(from t in Track, select: count(t.id)) |> Enum.at(0)
    render(conn, "index.json", tracks: tracks, track_count: track_count)
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
        |> render(SummerSinger.ChangesetView, "error.json", changeset: changeset)
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
        |> render(SummerSinger.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    track = Repo.get!(Track, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(track)

    send_resp(conn, :no_content, "")
  end

  defp limit_tracks(offset, limit) when is_nil(offset) and is_nil(limit) do
    Repo.all from t in Track,
    preload: [:artist, :album]
  end

  defp limit_tracks(offset, limit) do
    Repo.all from t in Track,
    order_by: t.title,
    offset: ^offset, limit: ^limit,
    preload: [:artist, :album]
  end
end
