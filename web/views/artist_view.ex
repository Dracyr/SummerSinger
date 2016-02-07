defmodule SummerSinger.ArtistView do
  use SummerSinger.Web, :view

  def render("index.json", %{artists: artists}) do
    %{artists: render_many(artists, SummerSinger.ArtistView, "artist.json")}
  end

  def render("show.json", %{artist: artist}) do
    %{artist: render_one(artist, SummerSinger.ArtistView, "artist.json"),
      tracks: render_many(artist.tracks, SummerSinger.TrackView, "track.json"),
      albums: render_many(artist.albums, SummerSinger.AlbumView, "album.json")}
  end

  def render("artist.json", %{artist: artist}) do
    %{id: artist.id,
      name: artist.name}
  end
end
