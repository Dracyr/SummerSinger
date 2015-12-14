defmodule GrooveLion.PlaylistView do
  use GrooveLion.Web, :view

  def render("index.json", %{playlists: playlists}) do
    %{data: render_many(playlists, GrooveLion.PlaylistView, "playlist.json")}
  end

  def render("show.json", %{playlist: playlist}) do
    %{data: render_one(playlist, GrooveLion.PlaylistView, "playlist.json")}
  end

  def render("playlist.json", %{playlist: playlist}) do
    %{id: playlist.id,
      title: playlist.title}
  end
end
