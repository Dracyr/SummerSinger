defmodule SummerSinger.Web.FileSystemController do
  use SummerSinger.Web, :controller

  def show(conn, %{"path" => path}) do
    case File.ls(path) do
      {:ok, dirs} ->
        conn
        |> json(%{
          path: path,
          children: Enum.filter(dirs, &File.dir?(Path.join(path, &1)))
        })
      {:error, reason} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: reason})
    end
  end
end
