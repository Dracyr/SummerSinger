defmodule Importer.Matcher do
  alias AutoTagger.TrackInfo

  def do_stuff do
    # data = Importer.Flattener.fetch_stuff
    path = "/home/dracyr/Music/Albums/Fleet Foxes - Helplessness Blues (2011)/08 - Lorelai.mp3"
  end

  def get_data_for_track(path) do
    {:ok, audio_info, track_info, cover} = SummerSinger.Importer.MusicTagger.read(path)
  end

  def tag_track(track_info, search_artist \\ nil, search_title \\ nil) do
    # find by mbdi

    {search_artist, search_title} =
      if !(search_artist && search_title) do
        {track_info["ARTIST"], track_info["TITLE"]}
      end
    IO.inspect("Searching for #{search_artist} - #{search_title}")

    candidates(search_artist, search_title)
  end

  def candidates(search_artist, search_title) do

  end
end
