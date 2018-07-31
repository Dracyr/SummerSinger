defmodule Importer.Matcher do
  alias AutoTagger.TrackInfo
  require IEx

  def do_stuff do
    # data = Importer.Flattener.fetch_stuff
    # path = "/home/dracyr/Music/Albums/Fleet Foxes - Helplessness Blues (2011)/08 - Lorelai.mp3"
    # path = "/Users/pepe/Music/Kishi Bashi - Sonderlust/Kishi Bashi - Sonderlust - 02 Hey Big Star.mp3"
    path = "/home/dracyr/Music/Albums/Fleet Foxes - Helplessness Blues (2011)/08 - Lorelai.mp3"
    track_info = get_data_for_track(path)
    tag_track(track_info)
  end

  def get_tags do
    path = "/home/dracyr/Music/Albums/Daft Punk - Random Access Memories (2013)/13 - Contact.flac"
    {:ok, audio_info, track_info, cover} = SummerSinger.Importer.MusicTagger.read(path)
    track_info
  end

  def do_album_stuff do
    path = "/home/dracyr/Music/Albums/Daft Punk - Random Access Memories (2013)/"
    %{tracks: tracks} = Importer.Scanner.scan!(path)

    Enum.map(tracks, fn track_path ->
      {:ok, audio_info, track_info, cover} = SummerSinger.Importer.MusicTagger.read(track_path)
      track_info
    end)
    |> tag_album
  end

  def get_data_for_track(path) do
    {:ok, audio_info, track_info, cover} = SummerSinger.Importer.MusicTagger.read(path)
    TrackInfo.from_metadata(track_info)
  end

  def tag_track(track_info, search_artist \\ nil, search_title \\ nil) do
    # find by mbdi

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

    Enum.reduce(fields, %{}, fn field, acc ->
      values = Enum.reduce(items, [], fn item, acc -> acc ++ [item[field]] end)
      {likely, consensus} = plurality(values)

      Map.put(acc, field, {likely, consensus})
    end)
  end

  @va_artists ["various artists", "various", "va", "unknown"]
  def tag_album(items, search_artist \\ nil, search_album \\ nil, search_ids \\ []) do
    fields = current_metadata(items)

    cur_artist =
      case fields["ALBUMARTIST"] do
        {value, true} when not is_nil(value) -> value
        _ -> elem(fields["ARTIST"], 0)
      end

    {cur_album, _} = fields["ALBUM"]

    IO.inspect("Tagging #{cur_artist} - #{cur_album}")
    # if search_ids, search by ids
    # Also try to get musicbarinz id and to that dance

    # Is this album likely to be a "various artist" release?
    # case for comp?
    va_likely = not elem(fields["ARTIST"], 1) || String.downcase(cur_artist) in @va_artists

    album_candidates(items, cur_artist, cur_album, va_likely)
  end

  def candidates(track_info, search_artist, search_title) do
    AutoTagger.MBrainz.search_recording(search_artist, search_title)
    |> Enum.map(fn recording ->
      dist =
        Importer.Distance.track_distance(track_info, recording)
        |> Importer.Distance.distance()

      {dist, recording}
    end)
    |> Enum.sort(&(elem(&1, 0) >= elem(&2, 0)))
  end

  def assign_items(items, tracks) do
    costs =
      items
      |> Enum.map(&TrackInfo.from_metadata/1)
      |> Enum.map(fn item ->
        Enum.map(tracks, &Importer.Distance.track_distance(&1, item))
        |> Enum.map(&Importer.Distance.distance/1)
      end)

    # NAH MAN, munkres is hard, just matched based on track number instead
  end

  def album_candidates(items, search_artist, search_album, va_likely) do
    AutoTagger.MBrainz.search_album(search_artist, search_album)
    |> Enum.map(fn release ->
      # {mapping, extra_items, extra_tracks} = assign_items(items, release.tracks)
      # Importer.Distance.album_distance(items, release)
      assign_items(items, release.tracks)
    end)
  end

  @recommendation_none 0
  @recommendation_low 1
  @recommendation_medium 2
  @recommendation_strong 3

  @strong_rec_thresh 0.04
  @medium_rec_thresh 0.25
  @rec_gap_thresh 0.25

  def recommendation([]), do: @recommendation_none
  def recommendation([{dist, _} | _]) when dist > @strong_rec_thresh, do: @recommendation_strong
  def recommendation([{dist, _} | _]) when dist > @medium_rec_thresh, do: @recommendation_medium
  def recommendation(results) when length(results) == 1, do: @recommendation_low

  def recommendation([{d1, _}, {d2, _} | _]) when d2 - d1 >= @rec_gap_thresh,
    do: @recommendation_low

  def recommendation(_), do: @recommendation_none
end
