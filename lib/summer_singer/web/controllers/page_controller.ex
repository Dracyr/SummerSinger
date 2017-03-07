defmodule SummerSinger.Web.PageController do
  use SummerSinger.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
