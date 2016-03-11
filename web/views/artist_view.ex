defmodule SummerSinger.ArtistView do
  use SummerSinger.Web, :view

  def render("index.json", %{artists: artists, artist_count: artist_count}) do
    %{
      total: artist_count,
      data: render_many(artists, SummerSinger.ArtistView, "artist.json")
    }
  end

  def render("show.json", %{artist: artist}) do
    %{data: render_one(artist, SummerSinger.ArtistView, "artist_details.json")}
  end


  def render("artist_details.json", %{artist: artist}) do
    %{
      id: artist.id,
      name: artist.name,
      albums: render_many(artist.albums, SummerSinger.AlbumView, "album.json"),
      tracks: render_many(artist.tracks, SummerSinger.TrackView, "track.json")
    }
  end

  def render("artist.json", %{artist: artist}) do
    %{
      id: artist.id,
      name: artist.name
    }
  end
end
