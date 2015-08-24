defmodule GrooveLion.PageController do
  use GrooveLion.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
