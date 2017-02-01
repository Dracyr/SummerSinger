defmodule SummerSinger.TrackController do
  use SummerSinger.Web, :controller
  use Filterable

  alias SummerSinger.Track
  import Ecto.Query

  plug :scrub_params, "track" when action in [:create, :update]

  defmodule Filterable do
    def search(_conn, query, value) do
      query |> Track.search(value)
    end

    def limit(_conn, query, value) do
      query |> limit(^value)
    end

    def offset(_conn, query, value) do
      query |> offset(^value)
    end

    def inbox(_conn, query, value) when value in ~w(true false) do
      query |> where(inbox: ^value)
    end

    def sort_by(conn, query, value) when value in ~w(title album artist rating) do
      sort_dir = conn.params["sort_dir"]
      query |> Track.order_by(value, sort_dir)
    end
  end

  def index(conn, _params) do
    is_inbox = (conn.params["inbox"] == "true")

    tracks = Track
    |> apply_filters(conn)
    |> (&(if is_inbox, do: &1, else: &1 |> where(inbox: false))).()
    |> Repo.all
    |> Repo.preload([:artist, :album])

    track_count = Repo.all(from t in Track, select: count(t.id), where: t.inbox == ^is_inbox) |> Enum.at(0)
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
        SummerSinger.RoomChannel.track_update(track)
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

  def clear_inbox(conn, %{}) do
    Repo.update_all(Track, set: [inbox: false])
    send_resp(conn, :no_content, "")
  end
end
