defmodule SummerSinger.Web.LibraryController do
  use SummerSinger.Web, :controller

  alias SummerSinger.Library

  def index(conn, _params) do
    libraries = Repo.all(Library)
    render(conn, "index.json", libraries: libraries)
  end

  def create(conn, %{"library" => library_params}) do
    changeset = Library.changeset(%Library{}, library_params)

    case Repo.insert(changeset) do
      {:ok, library} ->
        SummerSinger.Web.RoomChannel.update(%{
          resource_type: :library,
          action: :create,
          resource: library,
        })

        conn
        |> put_status(:created)
        |> put_resp_header("location", library_path(conn, :show, library))
        |> render("show.json", library: library)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(SummerSinger.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    library = Repo.get!(Library, id)
    render(conn, "show.json", library: library)
  end

  def update(conn, %{"id" => id, "library" => library_params}) do
    library = Repo.get!(Library, id)
    changeset = Library.changeset(library, library_params)

    case Repo.update(changeset) do
      {:ok, library} ->
        render(conn, "show.json", library: library)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(SummerSinger.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    library = Repo.get!(Library, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(library)

    send_resp(conn, :no_content, "")
  end
end
