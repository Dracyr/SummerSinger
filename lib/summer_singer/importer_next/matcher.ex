defmodule Importer.Matcher do
  alias AutoTagger.TrackInfo

  def do_stuff do
    # data = Importer.Flattener.fetch_stuff
    # path = "/home/dracyr/Music/Albums/Fleet Foxes - Helplessness Blues (2011)/08 - Lorelai.mp3"
    # path = "/Users/pepe/Music/Kishi Bashi - Sonderlust/Kishi Bashi - Sonderlust - 02 Hey Big Star.mp3"
    path = "/home/dracyr/Music/Albums/Fleet Foxes - Helplessness Blues (2011)/08 - Lorelai.mp3"
    track_info = get_data_for_track(path)
    tag_track(track_info)
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

  def candidates(track_info, search_artist, search_title) do
    AutoTagger.MBrainz.search_recording(search_artist, search_title)
    |> Enum.map(fn recording ->
      dist =
        Importer.Distance.track_distance(track_info, recording)
        |> Importer.Distance.distance
      {dist, recording}
    end)
    |> Enum.sort(&(elem(&1, 0) >= elem(&2, 0)))
  end

  @recommendation_none 0
  @recommendation_low 1
  @recommendation_medium 2
  @recommendation_strong 3

  @strong_rec_thresh 0.96
  @medium_rec_thresh 0.75
  @rec_gap_thresh 0.25

  def recommendation([]), do: @recommendation_none
  def recommendation([{dist, _} | _]) when dist > @strong_rec_thresh, do: @recommendation_strong
  def recommendation([{dist, _} | _]) when dist > @medium_rec_thresh, do: @recommendation_medium
  def recommendation(results) when length(results) == 1, do: @recommendation_low
  def recommendation([{d1, _}, {d2, _} | _]) when d2 - d1 >= @rec_gap_thresh, do: @recommendation_low
  def recommendation(_), do: @recommendation_none
end
