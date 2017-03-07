defmodule SummerSinger.Web.FolderController do
  use SummerSinger.Web, :controller
  import Ecto.Query

  alias SummerSinger.Folder

  plug :scrub_params, "folder" when action in [:create, :update]

  def index(conn, _params) do
    children_query = from f in Folder,
      order_by: f.title

    folders = Repo.all from f in Folder.orphans,
      order_by: f.title,
      preload: [:tracks, children: ^children_query]

    render(conn, "index.json", folders: folders)
  end

  def create(conn, %{"folder" => folder_params}) do
    changeset = Folder.changeset(%Folder{}, folder_params)

    case Repo.insert(changeset) do
      {:ok, folder} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", folder_path(conn, :show, folder))
        |> render("show.json", folder: folder)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(SummerSinger.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    folder = Repo.get!(Folder, id) |> Repo.preload([:children, tracks: [:artist, :album]])
    render(conn, "show.json", folder: folder)
  end

  def update(conn, %{"id" => id, "folder" => folder_params}) do
    folder = Repo.get!(Folder, id)
    changeset = Folder.changeset(folder, folder_params)

    case Repo.update(changeset) do
      {:ok, folder} ->
        render(conn, "show.json", folder: folder)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(SummerSinger.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    folder = Repo.get!(Folder, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(folder)

    send_resp(conn, :no_content, "")
  end
end
