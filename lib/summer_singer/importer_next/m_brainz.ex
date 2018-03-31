defmodule AutoTagger.MBrainz do
  alias AutoTagger.TrackInfo
  @base_url "http://musicbrainz.org/ws/2"

  def search_recording(artist, title) do
    params = %{
      query: "artist:\"#{artist}\" recording:\"#{title}\"",
      limit: 5,
      fmt: "json"
    } |> URI.encode_query

    res = HTTPoison.get!("#{@base_url}/recording/?#{params}")
    data = Poison.Parser.parse!(res.body)

    Enum.map(data["recordings"], &TrackInfo.from_data/1)
  end
end
