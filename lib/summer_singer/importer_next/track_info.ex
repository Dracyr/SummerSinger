defmodule AutoTagger.TrackInfo do
  alias AutoTagger.TrackInfo

  defstruct [:id,
            :title, #  name of the track
            :track_id, #  MusicBrainz ID; UUID fragment only
            :artist, #  individual track artist name
            :artist_id, # MusicBrainz ID; UUID fragment
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

  def track_url(track_id), do: "/recording/" <> track_id

  @locale "en" # Set in some kind of config?
  def preferred_alias(nil), do: nil
  def preferred_alias(aliases) do
    # Only consider aliases that have locales set.
    Enum.filter(aliases, &(&1["locale"] == @locale && &1["primary"]))
    |> Enum.at(0)
  end

  def get_artist_name(artist) when is_bitstring(artist), do: artist
  def get_artist_name(artist) do
     artist_alias = preferred_alias(artist["aliases"])

     cur_artist_name =
      if artist_alias, do: artist_alias["alias"], else: artist["artist"]["name"]

    artist_sort =
      cond do
        artist_alias ->
          artist_alias["sort-name"]
        artist["sort-name"] ->
          artist["sort-name"]
        true -> cur_artist_name
      end

    artist_credit =
      if artist["name"], do: artist["name"], else: cur_artist_name

    {cur_artist_name, artist_sort, artist_credit}
  end

  def add_artist(track_info, %{ "artist-credit" => nil }), do: track_info
  def add_artist(track_info, %{ "artist-credit" => artists }) do
    # Merge multiple artist into one
    {artist, artist_sort, artist_credit} =
      Enum.map(artists, &get_artist_name/1)
      |> Enum.reduce(fn ({a, a_s, a_c}, {a_1, a_s_1, a_c_1}) ->
        {"#{a} #{a_1}", "#{a_s} #{a_s_1}", "#{a_c} #{a_c_1}"}
      end)

    %{track_info |
      artist: artist,
      artist_sort: artist_sort,
      artist_credit: artist_credit,
      artist_id: Enum.at(artists, 0) |> get_in(["artist", "id"])
    }
  end

  def add_length(track_info, %{ "length" => nil }), do: nil
  def add_length(track_info, %{ "length" => track_length }) when is_integer(track_length) do
    %{track_info | length: track_length / 1000.0 }
  end
  def add_length(track_info, %{ "length" => track_length }) when is_bitstring(track_length) do
    %{track_info | length: String.to_integer(track_length) / 1000.0 }
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

  def from_metadata(track_info = %TrackInfo{}), do: track_info
  def from_metadata(metadata) do
    %TrackInfo{
      title: metadata["TITLE"],
      track_id: metadata["MUSICBRAINZ_TRACKID"], #  MusicBrainz ID; UUID fragment only
      artist: metadata["ARTIST"], #  individual track artist name
      artist_id: metadata["MUSICBRAINZ_ARTISTID"], # MusicBrainz ID; UUID fragment
      length: metadata["LENGTH"], #  float: duration of the track in seconds
      index: metadata["TRACKNUMBER"], #  position on the entire release
      media: metadata["MEDIA"], #  delivery mechanism (Vinyl, etc.)
      medium: metadata["DISC"], #  the disc number this track appears on in the album
      medium_index: metadata["TRACKNUMBER"], #  the track's position on the disc
      medium_total: metadata["TRACKTOTAL"], #  the number of tracks on the item's disc
      artist_sort: metadata["ARTISTSORT"], #  name of the track artist for sorting
      # disctitle: metadata[""], #  name of the individual medium (subtitle)
      artist_credit: metadata["ALBUMARTIST"], #  Recording-specific artist name
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
