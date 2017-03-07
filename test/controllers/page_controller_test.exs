defmodule SummerSinger.PageControllerTest do
  use SummerSinger.Web.ConnCase

  test "GET /" do
    conn = get conn(), "/"
    assert html_response(conn, 200) =~ "SummerSinger"
  end
end
