defmodule SummerSinger.Web.ArtistController do
  use SummerSinger.Web, :controller
  use Filterable.DSL

  plug :scrub_params, "artist" when action in [:create, :update]

  filter limit(query, value) do
    Ecto.Query.limit(query, ^value)
  end

  filter offset(query, value) do
    Ecto.Query.offset(query, ^value)
  end

  def index(conn, params) do
    # Tracks where !album or album.artist_id != artist_id
    albumless_tracks = from t in Track,
      join: a in assoc(t, :album),
      where: is_nil(t.album_id) or t.artist_id != a.artist_id,
      preload: [:artist, :album]

    artists =
      from(a in Artist,
        order_by: a.name,
        preload: [
          tracks: ^albumless_tracks,
          albums: [:artist, :cover_art, tracks: [:artist, :album]]
        ]
      )
      |> apply_filters(params)
      |> Repo.all

    artist_count =
      from(a in Artist, select: count(a.id))
      |> Repo.all
      |> Enum.at(0)

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
        |> render(SummerSinger.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    albumless_tracks = from t in Track,
      join: a in assoc(t, :album),
      where: is_nil(t.album_id) or t.artist_id != a.artist_id,
      preload: [:artist, :album]

    artist_query = from artist in Artist,
      order_by: artist.name,
      preload: [
        tracks: ^albumless_tracks,
        albums: [:artist, :cover_art, tracks: [:artist, :album]]
      ]

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
        |> render(SummerSinger.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    artist = Repo.get!(Artist, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(artist)

    send_resp(conn, :no_content, "")
  end
end
