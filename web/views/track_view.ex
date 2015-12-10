defmodule GrooveLion.TrackView do
  use GrooveLion.Web, :view

  def render("index.json", %{tracks: tracks}) do
    %{data: render_many(tracks, GrooveLion.TrackView, "track.json")}
  end

  def render("show.json", %{track: track}) do
    %{data: render_one(track, GrooveLion.TrackView, "track.json")}
  end

  def render("track.json", %{track: track}) do
    %{id: track.id,
      title: track.title,
      filename: track.filename,
      metadata: track.metadata,
      duration: track.duration,
      rating: track.rating}
  end
end
