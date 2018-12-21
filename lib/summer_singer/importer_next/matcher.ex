defmodule Importer.Matcher do
  alias AutoTagger.TrackInfo

  def match_track(path) do
    {audio_info, track_info} = get_data_for_track(path)
    tag_track({audio_info, track_info})
  end

  def match_album(path) do
    %{tracks: tracks} = Importer.Scanner.scan!(path)

    Enum.map(tracks, fn track_path ->
      {:ok, audio_info, track_info, _cover} = SummerSinger.Importer.MusicTagger.read(track_path)
      {audio_info, track_info}
    end)
    |> tag_album

    # What needs to happen after this is to update the tracks with new metadata
    # Then update the tracks in DB
    # Add an album and artist to DB
    # Which means we should try to carry number of objects through this
    #   * the list of tracks
    #   * An empty album thing, that we can then fill and insert into db, and the same for artist
    #   * and we want to surface some information on the matching to the frontend as well.
    #     So that is interesting, do we want to store that in the DB or just in memory for now?
    #     maybe as jsonb in a temp table? The case for storing would be that someone might restart hte
    #     rpi and have to re-index stuff, we don't want that!
  end

  def get_data_for_track(path) do
    {:ok, audio_info, track_info, cover} = SummerSinger.Importer.MusicTagger.read(path)
    TrackInfo.from_metadata(track_info, audio_info)
  end

  def tag_track({audio_info, track_info}, search_artist \\ nil, search_title \\ nil) do
    track_info = TrackInfo.from_metadata(track_info, audio_info)

    {search_artist, search_title} =
      if !(search_artist && search_title) do
        {track_info.artist, track_info.title}
      end

    IO.inspect("Searching for #{search_artist} - #{search_title}")

    candidates = candidates(track_info, search_artist, search_title)
    IO.inspect("Found #{length(candidates)} candidates")
    {candidates, recommendation(candidates)}
  end

  # Returns the most common value, along with if it was unique
  def plurality(values) do
    Enum.reduce(values, %{}, fn item, acc ->
      elem(
        Map.get_and_update(acc, item, fn current_value ->
          {current_value, (current_value || 0) + 1}
        end),
        1
      )
    end)
    |> Enum.to_list()
    # Sort by count
    |> Enum.sort_by(&elem(&1, 1))
    |> case do
      [{value, _}] -> {value, true}
      [{value, _} | _vs] -> {value, false}
    end
  end

  def current_metadata(items) do
    likelies = %{}
    consensus = %{}

    fields = [
      "ARTIST",
      "ALBUM",
      "ALBUMARTIST",
      "YEAR",
      "DISCTOTAL",
      "MUSICBRAINZ_ALBUMID",
      "LABEL",
      "CATALOGNUMBER",
      "COUNTRY",
      "MEDIA",
      "ALBUMDISAMBIG"
    ]

    tweaked_items =
      items
      |> Enum.map(fn item ->
        %{"index" => index, "total" => total} = TrackInfo.extract_medium_index(item)
        Map.put(item, "DISCTOTAL", total)
      end)

    Enum.reduce(fields, %{}, fn field, acc ->
      values = Enum.reduce(tweaked_items, [], fn item, acc -> acc ++ [item[field]] end)
      {likely, consensus} = plurality(values)

      Map.put(acc, field, {likely, consensus})
    end)
  end

  @va_artists ["various artists", "various", "va", "unknown"]
  def tag_album(items, search_artist \\ nil, search_album \\ nil, search_ids \\ []) do
    fields =
      Enum.map(items, fn {_audio, track_info} -> track_info end)
      |> current_metadata()

    cur_artist =
      case fields["ALBUMARTIST"] do
        {value, true} when not is_nil(value) -> value
        _ -> elem(fields["ARTIST"], 0)
      end

    {cur_album, _} = fields["ALBUM"]

    IO.inspect("Tagging #{cur_artist} - #{cur_album}")
    # if search_ids, search by ids
    # Also try to get musicbarinz id and do that dance

    # Is this album likely to be a "various artist" release?
    # case for comp?
    va_likely = not elem(fields["ARTIST"], 1) || String.downcase(cur_artist) in @va_artists

    likelies = Enum.map(fields, fn {k, {v, _}} -> {k, v} end) |> Map.new()

    candidates = album_candidates(items, cur_artist, cur_album, va_likely, likelies)
    {candidates, recommendation(candidates)}
  end

  def candidates(track_info, search_artist, search_title) do
    AutoTagger.MBrainz.search_recording(search_artist, search_title)
    |> Enum.map(fn recording ->
      dist =
        Importer.Distance.track_distance(track_info, recording)
        |> Importer.Distance.distance()

      {dist, recording}
    end)
    |> Enum.sort(&(elem(&1, 0) <= elem(&2, 0)))
  end

  # Calculate the distance for each item, track pair
  # And then calculate the optimal mapping
  def assign_items(items, tracks) do
    items
    |> Enum.map(fn item ->
      Enum.map(tracks, &Importer.Distance.track_distance(&1, item))
      |> Enum.map(&Importer.Distance.distance/1)
    end)
    |> (fn item_distances ->
          item_distances
          |> Munkres.compute()
          |> Enum.map(fn {i, j} ->
            score = Enum.at(item_distances, i) |> Enum.at(j)
            {score, i, j}
          end)
        end).()
  end

  def album_candidates(items, search_artist, search_album, va_likely, likelies) do
    items = Enum.map(items, fn {a, t} -> TrackInfo.from_metadata(a, t) end)

    AutoTagger.MBrainz.search_album(search_artist, search_album)
    |> Enum.map(fn release ->
      mapping = assign_items(items, release.tracks)

      metadata_mapping =
        Enum.map(mapping, fn {s, i, t} -> {Enum.at(items, i), Enum.at(release.tracks, t)} end)

      dist =
        Importer.Distance.album_distance(items, release, metadata_mapping, likelies)
        |> Importer.Distance.distance()

      # {dist, release, items, mapping}
      mmap =
        Enum.map(mapping, fn {s, i, t} ->
          %{score: s, stored: Enum.at(items, i), matched: Enum.at(release.tracks, t)}
        end)

      {dist, release, mmap}
    end)
    |> Enum.sort(&(elem(&1, 0) <= elem(&2, 0)))
  end

  @recommendation_none 0
  @recommendation_low 1
  @recommendation_medium 2
  @recommendation_strong 3
  @strong_rec_thresh 0.04
  @medium_rec_thresh 0.25
  @rec_gap_thresh 0.25

  def recommendation([]), do: @recommendation_none
  def recommendation([{dist, _} | _]) when dist < @strong_rec_thresh, do: @recommendation_strong
  def recommendation([{dist, _} | _]) when dist < @medium_rec_thresh, do: @recommendation_medium
  def recommendation(results) when length(results) == 1, do: @recommendation_low

  def recommendation([{d1, _}, {d2, _} | _]) when d2 - d1 >= @rec_gap_thresh,
    do: @recommendation_low

  def recommendation(_), do: @recommendation_none
end
