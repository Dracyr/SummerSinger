defmodule SummerSinger.AlbumView do
  use SummerSinger.Web, :view

  def render("index.json", %{albums: albums}) do
    %{data: render_many(albums, SummerSinger.AlbumView, "album.json")}
  end

  def render("show.json", %{album: album}) do
    %{data: render_one(album, SummerSinger.AlbumView, "album.json")}
  end

  def render("album.json", %{album: album}) do
    %{
      id: album.id,
      title: album.title,
      year: album.year,
      tracks: render_many(album.tracks, SummerSinger.TrackView, "track.json")
    }
  end
end
