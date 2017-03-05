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
    %{
      id: track.id,
      filename: Path.basename(track.path),
      title: track.title,
      artist: track.artist && track.artist.name,
      artist_id: track.artist_id,
      album: track.album && track.album.title,
      album_id: track.album_id,
      duration: track.duration,
      rating: track.rating,
      inbox: track.inbox
    }
  end
end
