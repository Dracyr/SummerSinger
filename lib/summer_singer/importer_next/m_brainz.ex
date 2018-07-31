defmodule AutoTagger.MBrainz do
  alias AutoTagger.{TrackInfo, AlbumInfo}
  @base_url "http://musicbrainz.org/ws/2"

  defp fetch(path, params) do
    IO.inspect("Fetching #{path}")
    res = HTTPoison.get!("#{@base_url}/#{path}?#{params}")
    Poison.Parser.parse!(res.body)
  end

  def search_recording(artist, title) do
    params =
      %{
        query: "artist:\"#{artist}\" recording:\"#{title}\"",
        limit: 5,
        fmt: "json"
      }
      |> URI.encode_query()

    fetch("recording/", params)
    |> Map.get("recordings")
    |> Enum.map(&TrackInfo.from_data/1)
  end

  def search_album(artist, album) do
    params =
      %{
        query: "artist:\"#{artist}\" release:\"#{album}\"",
        limit: 5,
        fmt: "json"
      }
      |> URI.encode_query()

    fetch("release/", params)
    |> Map.get("releases")
    |> Enum.map(fn release ->
      recording_params =
        %{
          fmt: "json",
          inc: "recordings+artists+artist-credits+release-groups+labels"
        }
        |> URI.encode_query()

      fetch("release/#{release["id"]}", recording_params)
    end)
    |> Enum.map(&AlbumInfo.from_data/1)
  end
end
