defmodule SummerSinger.ArtistController do
  use SummerSinger.Web, :controller

  alias SummerSinger.{Artist, Album, Track}

  plug :scrub_params, "artist" when action in [:create, :update]

  def index(conn, params) do
    artists = limit_artists(params["offset"], params["limit"])
    artist_count = Repo.all(from t in Artist, select: count(t.id)) |> Enum.at(0)
    render(conn, "index.json", artists: artists, artist_count: artist_count)
  end

  def create(conn, %{"artist" => artist_params}) do
    changeset = Artist.changeset(%Artist{}, artist_params)

    case Repo.insert(changeset) do
      {:ok, artist} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", artist_path(conn, :show, artist))
        |> render("show.json", artist: artist)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(SummerSinger.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    artist_query = from artist in Artist,
      order_by: artist.name,
      preload: [:tracks, albums: [tracks: :artist]]

    artist = Repo.get(artist_query, id)
    render(conn, "show.json", artist: artist)
  end

  def update(conn, %{"id" => id, "artist" => artist_params}) do
    artist = Repo.get!(Artist, id)
    changeset = Artist.changeset(artist, artist_params)

    case Repo.update(changeset) do
      {:ok, artist} ->
        render(conn, "show.json", artist: artist)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(SummerSinger.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    artist = Repo.get!(Artist, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(artist)

    send_resp(conn, :no_content, "")
  end

  defp limit_artists(offset, limit) when is_nil(offset) and is_nil(limit) do
    Repo.all from a in Artist,
      order_by: a.name
  end

  defp limit_artists(offset, limit) do
    Repo.all from a in Artist,
      order_by: a.name,
      offset: ^offset, limit: ^limit
  end
end
