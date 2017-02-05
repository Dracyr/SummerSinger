defmodule SummerSinger.ArtistView do
  use SummerSinger.Web, :view

  def render("index.json", %{artists: artists, artist_count: artist_count}) do
    %{
      total: artist_count,
      data: render_many(artists, SummerSinger.ArtistView, "artist.json")
    }
  end

  def render("show.json", %{artist: artist}) do
    %{data: render_one(artist, SummerSinger.ArtistView, "artist.json")}
  end

  def render("artist.json", %{artist: artist}) do
    image_url =
      artist.albums
      |> Enum.filter(& &1 && &1.cover_art)
      |> Enum.at(0)
      |> (fn
          nil -> nil
          album ->
            SummerSinger.CoverArt.Uploader.url({
              album.cover_art.cover_art,
              album.cover_art
            })
        end).()

    %{
      id: artist.id,
      name: artist.name,
      albums: render_many(artist.albums, SummerSinger.AlbumView, "album.json"),
      artist_tracks: render_many(artist.tracks, SummerSinger.TrackView, "track.json"),
      image_url: image_url
    }
  end
end
