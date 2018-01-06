defmodule Matcher do
  @base_url "http://musicbrainz.org/ws/2/"

  defmodule TrackInfo do
    defstruct [:id,
              :title, #  name of the track
              :track_id, #  MusicBrainz ID; UUID fragment only
              :artist, #  individual track artist name
              :artist_id,
              :length, #  float: duration of the track in seconds
              :index, #  position on the entire release
              :media, #  delivery mechanism (Vinyl, etc.)
              :medium, #  the disc number this track appears on in the album
              :medium_index, #  the track's position on the disc
              :medium_total, #  the number of tracks on the item's disc
              :artist_sort, #  name of the track artist for sorting
              :disctitle, #  name of the individual medium (subtitle)
              :artist_credit, #  Recording-specific artist name
              :data_source, #  The original data source (MusicBrainz, Discogs, etc.)
              :data_url, #  The data source release URL.
              :lyricist, #  individual track lyricist name
              :composer, #  individual track composer name
              :composer_sort, #  individual track composer sort name
              :arranger, #  individual track arranger name
              :track_alt] #  alternative track number (tape, vinyl, etc.)
  end

  def tag_album(items) do

  end

  def match_track(artist, title) do
    # res = MusicBrainz.search_recordings()
    # inc = Enum.join(includes
    # url = base_url <> entity
    # Regex.match?(~r/^[\S]*$/, a)
    # query =
    #   params
    #   |> Enum.map(fn {k, v} -> "#{k}:#{escape_whitespace(v)}" end)
    #   |> Enum.join(" AND ")
    searchlimit = 5

    params = %{
      # artist: artist,
      # recording: title,
      query: "artist:#{artist} AND recording:#{title}",
      limit: searchlimit,
      fmt: "json"
    } |> URI.encode_query

    IO.inspect(params)
    url = "#{@base_url}recording/?#{params}"
    IO.inspect(url)

    # HTTPoison.get!([base_url, entity, "?query=" <> URI.encode(query) <> "&fmt=json")
    res = HTTPoison.get!(url)
    {:ok, data} = Poison.Parser.parse(res.body)
    Enum.map(data["recordings"], &to_trackinfo/1)
  end

  def to_trackinfo(recording) do
    track_info = %TrackInfo{
      title: recording["title"],
      id: recording["id"],
      data_source: "MusicBrainz",
      data_url: track_url(recording["id"])
    }

    track_info =
      if Map.has_key?(recording, "artist-credit") do

      else
        track_info
      end
  end

  def escape_whitespace(string) do
    if String.match?(string, ~r/^[\S]*$/) do
      string
    else
      "\"" <> string <> "\""
    end
  end

  def track_url(track_id), do: @base_url <> "recording/" <> track_id
  def album_url(album_id), do: @base_url <> "release/" <> album_id
end
