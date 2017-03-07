defmodule SummerSinger.Web.AlbumView do
  use SummerSinger.Web, :view

  def render("index.json", %{albums: albums, album_count: album_count}) do
    %{
      total: album_count,
      data: render_many(albums, SummerSinger.Web.AlbumView, "album.json")
    }
  end

  def render("show.json", %{album: album}) do
    %{data: render_one(album, SummerSinger.Web.AlbumView, "album.json")}
  end

  def render("album.json", %{album: album}) do
    {cover_art_url, cover_art_thumb_url} =
      if album.cover_art do
        url =
          SummerSinger.CoverArt.Uploader.url({
            album.cover_art.cover_art,
            album.cover_art
          })

        thumb =
          SummerSinger.CoverArt.Uploader.url({
            album.cover_art.cover_art,
            album.cover_art
          }, :small)
        {url, thumb}
      else
        {nil, nil}
      end

    %{
      id: album.id,
      title: album.title,
      year: album.year,
      artist: album.artist.name,
      tracks: render_many(album.tracks, SummerSinger.Web.TrackView, "track.json"),
      cover_art_url: cover_art_url,
      cover_art_thumb_url: cover_art_thumb_url,
    }
  end
end
