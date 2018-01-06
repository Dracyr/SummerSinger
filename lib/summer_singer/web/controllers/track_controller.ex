defmodule SummerSinger.Web.TrackController do
  use SummerSinger.Web, :controller
  use Filterable.DSL
  alias Ecto.Query
  import Ecto.Query, only: [from: 2]

  plug :scrub_params, "track" when action in [:create, :update]

  filter search(query, value, _params) do
    Track.search(query, value)
  end

  filter limit(query, value, _params) do
    Query.limit(query, ^value)
  end

  filter offset(query, value, _params) do
    Query.offset(query, ^value)
  end

  filter sort_by(query, value, params) when value in ~w(title album artist rating) do
    Track.order_by(query, value, params["sort_dir"])
  end

  def index(conn, params) do
    tracks =
      from(t in Track,
        # where: t.imported and t.inbox == ^(params["inbox"] == "true"),
        preload: [:artist, :album],
      )
      |> apply_filters(params, share: params)
      |> Repo.all

    track_count =
      from(t in Track,
        # where: t.imported and t.inbox == ^(params["inbox"] == "true"),
        select: count(t.id))
      |> Repo.all()
      |> Enum.at(0)

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
        |> render(SummerSinger.Web.ChangesetView, "error.json", changeset: changeset)
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
        SummerSinger.Web.RoomChannel.track_update(track)
        render(conn, "show.json", track: track)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(SummerSinger.Web.ChangesetView, "error.json", changeset: changeset)
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
