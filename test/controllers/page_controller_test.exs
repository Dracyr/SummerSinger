defmodule GrooveLion.PageControllerTest do
  use GrooveLion.ConnCase

  test "GET /" do
    conn = get conn(), "/"
    assert html_response(conn, 200) =~ "GrooveLion"
  end
end
