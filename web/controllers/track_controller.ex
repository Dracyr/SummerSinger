defmodule SummerSinger.TrackController do
  use SummerSinger.Web, :controller
  alias SummerSinger.Track
  import Ecto.Query

  plug :scrub_params, "track" when action in [:create, :update]

  def index(conn, params) do
    tracks = case params do
      %{"search" => search_term} ->
        from(t in Track)
        |> Track.search(search_term)
      %{"sort_by" => sort_by, "sort_dir" => sort_dir} ->
        from(t in Track)
        |> Track.order_by(sort_by, sort_dir)
        |> limit_tracks(params["offset"], params["limit"])
      nil ->
        from(t in Track) |> limit_tracks(params["offset"], params["limit"])
    end |> Repo.all |> Repo.preload([:artist, :album])

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
    track = Repo.get!(Track, id) |> Repo.preload([:artist, :album])
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

  defp limit_tracks(query, offset, limit) when is_nil(offset) and is_nil(limit) do
    from t in query
  end

  defp limit_tracks(query, offset, limit) do
    from t in query,
    offset: ^offset, limit: ^limit
  end
end
