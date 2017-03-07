defmodule SummerSinger.Web.StatusController do
  use SummerSinger.Web, :controller
  alias SummerSinger.Player

  def show(conn, _params) do
    status = Player.status |> Map.merge(%{current_time: DateUtil.now})
    json conn, status
  end
end
