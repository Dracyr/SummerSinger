defmodule GrooveLion.ArtistView do
  use GrooveLion.Web, :view

  def render("index.json", %{artists: artists}) do
    %{artists: render_many(artists, GrooveLion.ArtistView, "artist.json")}
  end

  def render("show.json", %{artist: artist}) do
    %{artist: render_one(artist, GrooveLion.ArtistView, "artist.json"),
      tracks: render_many(artist.tracks, GrooveLion.TrackView, "track.json"),
      albums: render_many(artist.albums, GrooveLion.AlbumView, "album.json")}
  end

  def render("artist.json", %{artist: artist}) do
    %{id: artist.id,
      name: artist.name}
  end
end
