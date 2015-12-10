defmodule GrooveLion.AlbumView do
  use GrooveLion.Web, :view

  def render("index.json", %{albums: albums}) do
    %{data: render_many(albums, GrooveLion.AlbumView, "album.json")}
  end

  def render("show.json", %{album: album}) do
    %{data: render_one(album, GrooveLion.AlbumView, "album.json")}
  end

  def render("album.json", %{album: album}) do
    %{id: album.id,
      title: album.title,
      year: album.year}
  end
end
