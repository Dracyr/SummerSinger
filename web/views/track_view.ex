defmodule SummerSinger.TrackView do
  use SummerSinger.Web, :view

  def render("index.json", %{tracks: tracks, track_count: track_count}) do
    %{
      total: track_count,
      data: render_many(tracks, SummerSinger.TrackView, "track.json")
    }
  end

  def render("show.json", %{track: track}) do
    %{data: render_one(track, SummerSinger.TrackView, "track.json")}
  end

  def render("track.json", %{track: track}) do
    track = SummerSinger.Repo.preload(track, [:album, :artist])
    %{
      id: track.id,
      title: track.title,
      artist: track.artist && track.artist.name,
      duration: track.duration,
      rating: track.rating,
      album: track.album && track.album.title
    }
  end
end
