defmodule AutoTagger.TrackInfo do
  alias AutoTagger.TrackInfo
  @derive Poison.Encoder

  defstruct [
    :id,
    #  name of the track
    :title,
    #  MusicBrainz ID; UUID fragment only
    :track_id,
    #  individual track artist name
    :artist,
    # MusicBrainz ID; UUID fragment
    :artist_id,
    #  float: duration of the track in seconds
    :length,
    #  position on the entire release
    :index,
    #  delivery mechanism (Vinyl, etc.)
    :media,
    #  the disc number this track appears on in the album
    :medium,
    #  the track's position on the disc
    :medium_index,
    #  the number of tracks on the item's disc
    :medium_total,
    #  name of the track artist for sorting
    :artist_sort,
    #  name of the individual medium (subtitle)
    :disctitle,
    #  Recording-specific artist name
    :artist_credit,
    #  The original data source (MusicBrainz, Discogs, etc.)
    :data_source,
    #  The data source release URL.
    :data_url,
    #  individual track lyricist name
    :lyricist,
    #  individual track composer name
    :composer,
    #  individual track composer sort name
    :composer_sort,
    #  individual track arranger name
    :arranger,
    #  alternative track number (tape, vinyl, etc.)
    :track_alt
  ]

  def track_url(track_id), do: "/recording/" <> track_id

  # Set in some kind of config?
  @locale "en"
  def preferred_alias(nil), do: nil

  def preferred_alias(aliases) do
    # Only consider aliases that have locales set.
    Enum.filter(aliases, &(&1["locale"] == @locale && &1["primary"]))
    |> Enum.at(0)
  end

  def get_artist_name(artist) when is_bitstring(artist), do: artist

  def get_artist_name(artist) do
    artist_alias = preferred_alias(artist["aliases"])

    cur_artist_name = if artist_alias, do: artist_alias["alias"], else: artist["artist"]["name"]

    artist_sort =
      cond do
        artist_alias ->
          artist_alias["sort-name"]

        artist["sort-name"] ->
          artist["sort-name"]

        true ->
          cur_artist_name
      end

    artist_credit = if artist["name"], do: artist["name"], else: cur_artist_name

    {cur_artist_name, artist_sort, artist_credit}
  end

  def add_artist(track_info, %{"artist-credit" => nil}), do: track_info

  def add_artist(track_info, %{"artist-credit" => artists}) do
    # Merge multiple artist into one
    {artist, artist_sort, artist_credit} =
      Enum.map(artists, &get_artist_name/1)
      |> Enum.reduce(fn {a, a_s, a_c}, {a_1, a_s_1, a_c_1} ->
        {"#{a} #{a_1}", "#{a_s} #{a_s_1}", "#{a_c} #{a_c_1}"}
      end)

    %{
      track_info
      | artist: artist,
        artist_sort: artist_sort,
        artist_credit: artist_credit,
        artist_id: Enum.at(artists, 0) |> get_in(["artist", "id"])
    }
  end

  def add_length(track_info, %{"length" => nil}), do: nil

  def add_length(track_info, %{"length" => track_length}) when is_integer(track_length) do
    %{track_info | length: track_length / 1000.0}
  end

  def add_length(track_info, %{"length" => track_length}) when is_bitstring(track_length) do
    %{track_info | length: String.to_integer(track_length) / 1000.0}
  end

  def track_info(recording, medium, medium_index, medium_total) do
    %TrackInfo{
      title: recording["title"],
      id: recording["id"],
      track_id: recording["id"],
      data_source: "MusicBrainz",
      data_url: track_url(recording["id"]),
      medium: medium,
      medium_index: medium_index,
      medium_total: medium_total
    }
  end

  def from_data(recording, medium \\ nil, medium_index \\ nil, medium_total \\ nil) do
    recording
    |> track_info(medium, medium_index, medium_total)
    |> add_artist(recording)
    |> add_length(recording)
  end

  def extract_medium_index(metadata) do
    %{"index" => index, "total" => total} =
      Regex.named_captures(~r/0*(?<index>\d+)[^\d]*0*(?<total>\d+)?/, metadata["TRACKNUMBER"])

    %{"index" => index, "total" => metadata["TRACKTOTAL"] || metadata["DISCTOTAL"] || total}
  end

  def from_metadata(track_info = %TrackInfo{}), do: track_info

  def from_metadata(audio_info, metadata) do
    %{"index" => index, "total" => total} = extract_medium_index(metadata)

    %TrackInfo{
      title: metadata["TITLE"],
      #  MusicBrainz ID; UUID fragment only
      track_id: metadata["MUSICBRAINZ_TRACKID"],
      #  individual track artist name
      artist: metadata["ARTIST"],
      # MusicBrainz ID; UUID fragment
      artist_id: metadata["MUSICBRAINZ_ARTISTID"],
      #  float: duration of the track in seconds
      length: metadata["LENGTH"] || audio_info["duration"],
      #  position on the entire release
      index: metadata["TRACKNUMBER"],
      #  delivery mechanism (Vinyl, etc.)
      media: metadata["MEDIA"],
      #  the disc number this track appears on in the album
      medium: metadata["DISC"],
      #  the track's position on the disc
      medium_index: index,
      #  the number of tracks on the item's disc
      medium_total: total,
      #  name of the track artist for sorting
      artist_sort: metadata["ARTISTSORT"],
      # disctitle: metadata[""], #  name of the individual medium (subtitle)
      #  Recording-specific artist name
      artist_credit: metadata["ALBUMARTIST"]
      # data_source: metadata["MusicBrainz"], #  The original data source (MusicBrainz, Discogs, etc.)
      # data_url: metadata[""], #  The data source release URL.
      # lyricist: metadata[""], #  individual track lyricist name
      # composer: metadata[""], #  individual track composer name
      # composer_sort: metadata[""], #  individual track composer sort name
      # arranger: metadata[""], #  individual track arranger name
      # :track_alt
    }
  end
end
