defmodule Importer.Distance do
  alias AutoTagger.TrackInfo
  alias Importer.Distance

  defstruct penalties: []

  @distance_weights %{
    source: 2.0,
    artist: 3.0,
    album: 3.0,
    media: 1.0,
    mediums: 1.0,
    year: 1.0,
    country: 0.5,
    label: 0.5,
    catalognum: 0.5,
    albumdisambig: 0.5,
    album_id: 5.0,
    tracks: 2.0,
    missing_tracks: 0.9,
    unmatched_tracks: 0.6,
    track_title: 3.0,
    track_artist: 2.0,
    track_index: 1.0,
    track_length: 2.0,
    track_id: 5.0
  }

  def track_length(dist, %{length: nil}, %{length: nil}), do: dist
  def track_length(dist, %{length: nil}, _), do: dist
  def track_length(dist, _, %{length: nil}), do: dist

  def track_length(dist, %{length: item_length}, %{length: track_length}) do
    # - some magic number
    diff = abs(item_length - track_length)
    # 10 is also some magic number
    add_ratio(dist, :track_length, diff, 10)
  end

  # Artist signals that indicate "various artists". These are used at the
  # album level to determine whether a given release is likely a VA
  # release and also on the track level to to remove the penalty for
  # differing artists.
  @va_artists ["", "various artists", "various", "va", "unknown"]

  def artist(dist, nil, _), do: dist
  def artist(dist, _, %TrackInfo{ artist: nil}), do: dist
  def artist(dist, item, track_info) do
    if String.downcase(track_info.artist) not in @va_artists  do
      add_string(dist, :track_artist, item.artist, track_info.artist)
    else
      dist
    end
  end

  def track_index(dist, %{index: nil}, _), do: dist
  def track_index(dist, _, %{index: nil}), do: dist
  def track_index(dist, item, track_info) do
    add_expr(
      dist,
      :track_index,
      !(item.index not in [track_info.medium_index, track_info.index])
    )
  end

  def track_id(dist, item, track_info) do
    add_expr(dist, :track_id, item.track_id != track_info.track_id)
  end

  def track_distance(item = %TrackInfo{}, track_info = %TrackInfo{}) do
    %Importer.Distance{}
    |> track_length(item, track_info)
    |> add_string(:track_title, item.title, track_info.title)
    |> artist(item, track_info)
    |> track_index(item, track_info)
    |> track_id(item, track_info)
  end

  # Beets does a bunch of stuff with options, but the defaults are empty
  # and this should do the same as that
  def album_distance(items, release, mapping, likelies) do
    %Importer.Distance{}
    |> add_string(:album, likelies["ALBUM"], release.album)
    |> add_if(not release.va,
      fn dist -> add_string(dist, :artist, likelies["ARTIST"], release.artist) end)
    |> add_if(likelies["DISCTOTAL"] && release.mediums,
      fn dist -> add_number(dist, :disctotal, likelies["DISCTOTAL"], release.mediums) end)
    |> add_if(likelies["MUSICBRAINZ_ALBUMID"] && release.album_id,
      fn dist -> add_expr(dist, :album_id, likelies["MUSICBRAINZ_ALBUMID"] == release.album_id) end)
    |> add_if(likelies["ALBUMDISAMBIG"] && release.albumdisambig,
      fn dist -> add_string(dist, :albumdisambig, likelies["ALBUMDISAMBIG"], release.albumdisambig) end)
    |> add_if(likelies["CATALOGNUMBER"] && release.catalognum,
      fn dist -> add_string(dist, :catalognum, likelies["CATALOGNUMBER"], release.catalognum) end)
    |> add_if(likelies["LABEL"] && release.label,
      fn dist -> add_string(dist, :label, likelies["LABEL"], release.label) end)
    |> add_if(likelies["COUNTRY"] && release.country,
      fn dist -> add_string(dist, :country, likelies["COUNTRY"], release.country) end)
    |> add_if(likelies["YEAR"] && release.year, fn dist ->
          cond do
            likelies["YEAR"] == release.year || likelies["YEAR"] == release.original_year ->
              add(dist, :year, 0.0)
            release.original_year ->
              diff = abs(likelies["YEAR"] - release.year)
              diff_max = abs(Map.fetch!(DateTime.utc_now, :year) - release.original_year)
              add_ratio(dist, :year, diff, diff_max)
            true ->
              add(dist, :year, 1.0)
          end
        end)
    # Tracks!
    |> (fn dist ->
      Enum.reduce(mapping, dist, fn ({item, track}, r_dist) ->
        track_distance =
          item
          |> TrackInfo.from_metadata
          |> Importer.Distance.track_distance(track)
          |> Importer.Distance.distance
        add(r_dist, :tracks, track_distance)
      end)
    end).()
    |> add_number(:missing_tracks, length(release.tracks), length(mapping))
    |> add_number(:unmatched_tracks, length(items), length(mapping))
  end

  def distance(dist) do
    # In the beets version there can be multiple penalties per key, we skip that now
    raw_distance =
      Enum.reduce(dist.penalties, 0.0, fn {k, v}, acc -> acc + (v * @distance_weights[k]) end)
    max_distance =
      Enum.reduce(dist.penalties, 0.0, fn {k, _v}, acc -> acc + @distance_weights[k] end)

    raw_distance / max_distance
  end

  def add_if(dist, true, dist_penalty), do: dist_penalty.(dist)
  def add_if(dist, _, _), do: dist

  def add_expr(dist, key, expr) do
    if expr do
      add(dist, key, 1.0)
    else
      add(dist, key, 0.0)
    end
  end

  def add_ratio(dist, key, _, nil), do: add(dist, key, 0.0)
  def add_ratio(dist, key, _, 0.0), do: add(dist, key, 0.0)
  def add_ratio(dist, key, number_1, number_2) do
    number = min(number_1, number_2) |> max(0)
    add(dist, key, number / number_2)
  end

  # Parameters for string distance function.
  # Words that can be moved to the end of a string using a comma.
  @end_words ["the", "a", "an"]
  # Reduced weights for certain portions of the string.
  @sd_patterns [
    {~r/^the /, 0.1},
    {~r/[\[\(]?(ep|single)[\]\)]?/, 0.0},
    {~r/[\[\(]?(featuring|feat|ft)[\. :].+/, 0.1},
    {~r/\(.*?\)/, 0.3},
    {~r/\[.*?\]/, 0.3},
    {~r/(, )?(pt\.|part) .+/, 0.2},
  ]
  # Replacements to use before testing distance.
  @sd_replace [
      {~r/&/, "and"},
  ]

  def move_end_word(string, end_word) do
    if String.ends_with?(string, ", #{end_word}") do
      string
      |> String.replace_suffix(", #{end_word}", "")
      |> String.replace_prefix("", "#{end_word} ")
    else
      string
    end
  end

  def prepare_string(string) do
    string =
      string
      |> String.downcase
      |> String.normalize(:nfc)
    # Basic replacements, such as '& -> and'
    string = Enum.reduce(@sd_replace, string, fn ({pat, rep}, s) -> String.replace(s, pat, rep) end)
    # Don't penalize strings that move certain words to the end. For
    # example, "the something" should be considered equal to "something, the".
    Enum.reduce(@end_words, string, fn (ew, s) -> move_end_word(s, ew) end)
  end

  def string_basic_dist(string_1, string_2) do
    # Beets uses the Levenshtein distance instead
    # distance = Simetric.Levenshtein.compare(string_1, string_2)
    # normalize = max(String.length(string_1), String.length(string_2)) * 1.0
    # distance / normalize

    1 - String.jaro_distance(string_1, string_2)
  end

  def string_case_penalty(string_1, string_2, base_dist) do
    Enum.reduce(@sd_patterns, {0.0, string_1, string_2}, fn ({pat, weight}, {acc, s1, s2}) ->
      case_1 = String.replace(s1, pat, "")
      case_2 = String.replace(s2, pat, "")

      if case_1 != string_1 or case_2 != string_2 do
        case_dist = string_basic_dist(case_1, case_2)
        case_delta = max(0.0, base_dist - case_dist)

        if case_delta != 0.0,
          do: {acc + (weight * case_delta), case_1, case_2},
          else: {acc, s1, s2}
      else
        {acc, s1, s2}
      end
    end)
    |> elem(0)
  end

  def add_string(dist, key, nil, nil), do: add(dist, key, 0.0)
  def add_string(dist, key, string_1, string_2) when is_nil(string_1) or is_nil(string_2),
    do: add(dist, key, 1.0)
  def add_string(dist, key, string_1, string_2) do
    string_1 = prepare_string(string_1)
    string_2 = prepare_string(string_2)
    base_dist = string_basic_dist(string_1, string_2)
    penalty = string_case_penalty(string_1, string_2, base_dist)

    add(dist, key, base_dist + penalty)
  end

  defp add(dist, key, penalty) do
    %Distance{dist | penalties: dist.penalties ++ [{key, penalty}]}
  end

  def add_number(dist, key, number_1, number_2) do
    diff = abs(number_1 - number_2)
    if diff != 0.0 do
      Enum.reduce(1..diff, dist, fn (_, r_dist) -> add(r_dist, key, 1.0) end)
    else
      add(dist, key, 0.0)
    end
  end
end
