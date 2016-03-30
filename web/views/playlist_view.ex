defmodule SummerSinger.PlaylistView do
  use SummerSinger.Web, :view

  def render("index.json", %{playlists: playlists}) do
    %{data: render_many(playlists, SummerSinger.PlaylistView, "playlist.json")}
  end

  def render("show.json", %{playlist: playlist}) do
    %{
      data: render_one(playlist, SummerSinger.PlaylistView, "playlist_tracks.json"),
    }
  end

  def render("create.json", %{playlist: playlist}) do
    %{
      data: render_one(playlist, SummerSinger.PlaylistView, "playlist.json"),
    }
  end

  def render("playlist.json", %{playlist: playlist}) do
    %{
      id: playlist.id,
      title: playlist.title
    }
  end

  def render("playlist_tracks.json", %{playlist: playlist}) do
    %{
      id: playlist.id,
      title: playlist.title,
      tracks: render_many(playlist.tracks, SummerSinger.TrackView, "track.json")
    }
  end
end
