defmodule SummerSinger.TrackView do
  use SummerSinger.Web, :view

  def render("index.json", %{tracks: tracks}) do
    %{data: render_many(tracks, SummerSinger.TrackView, "track.json")}
  end

  def render("show.json", %{track: track}) do
    %{data: render_one(track, SummerSinger.TrackView, "track.json")}
  end

  def render("track.json", %{track: track}) do
    %{id: track.id,
      title: track.title,
      artist: track.artist.name,
      duration: track.duration,
      rating: track.rating}
  end
end
