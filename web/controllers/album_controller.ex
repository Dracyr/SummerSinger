defmodule SummerSinger.AlbumController do
  use SummerSinger.Web, :controller
  import Ecto.Query
  alias SummerSinger.Album

  plug :scrub_params, "album" when action in [:create, :update]

  def index(conn, _params) do
    albums = Repo.all(Album) |> Repo.preload(tracks: [:artist, :album])
    render(conn, "index.json", albums: albums)
  end

  def create(conn, %{"album" => album_params}) do
    changeset = Album.changeset(%Album{}, album_params)

    case Repo.insert(changeset) do
      {:ok, album} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", album_path(conn, :show, album))
        |> render("show.json", album: album)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(SummerSinger.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    album = Repo.get!(Album, id) |> Repo.preload(tracks: [:artist, :album])
    render(conn, "show.json", album: album)
  end

  def update(conn, %{"id" => id, "album" => album_params}) do
    album = Repo.get!(Album, id)
    changeset = Album.changeset(album, album_params)

    case Repo.update(changeset) do
      {:ok, album} ->
        render(conn, "show.json", album: album)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(SummerSinger.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    album = Repo.get!(Album, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(album)

    send_resp(conn, :no_content, "")
  end
end
