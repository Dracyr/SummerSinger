defmodule SummerSinger.Web.QueueController do
  use SummerSinger.Web, :controller
  alias SummerSinger.Queue

  def show(conn, _params) do
    json conn, Queue.queue
  end
end
