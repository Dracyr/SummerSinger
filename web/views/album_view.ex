defmodule SummerSinger.AlbumView do
  use SummerSinger.Web, :view

  def render("index.json", %{albums: albums, album_count: album_count}) do
    %{
      total: album_count,
      data: render_many(albums, SummerSinger.AlbumView, "album.json")
    }
  end

  def render("show.json", %{album: album}) do
    %{data: render_one(album, SummerSinger.AlbumView, "album.json")}
  end

  def render("album.json", %{album: album}) do
    %{
      id: album.id,
      title: album.title,
      year: album.year,
      artist: album.artist.name,
      tracks: render_many(album.tracks, SummerSinger.TrackView, "track.json")
    }
  end
end
