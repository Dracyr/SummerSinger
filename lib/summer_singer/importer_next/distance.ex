defmodule Importer.Distance do
  alias AutoTagger.TrackInfo
  alias Importer.Distance

  defstruct [
    penalties: %{}
  ]

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

  def track_length(dist, %TrackInfo{length: nil}, %TrackInfo{length: nil}), do: dist
  def track_length(dist, %TrackInfo{length: nil}, _), do: dist
  def track_length(dist, _, %TrackInfo{length: nil}), do: dist
  def track_length(dist, %TrackInfo{length: item_length}, %TrackInfo{length: track_length}) do
    IO.inspect(item_length)
    IO.inspect(track_length)
    diff = abs(item_length - track_length) # - some magic number
    add_ratio(dist, :track_length, diff, 10) # 10 is also some magic number
  end

  # check so that artist exists
  def artist(dist, item, track_info) do
    # also check so that aritist is not in VA artists

    add_string(dist, :track_artist, item.artist, track_info.artist)
  end

  def track_index(dist, item, track_info) do
    add_expr(dist, :track_index, track_info.index && item.index  && !(item.track not in [track_info.medium_index, track_info.index]))
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

  def distance(dist) do
    # In the beets version there can be multiple penalties per key, we skip that now
    max_distance = Enum.reduce(dist.penalties, 0.0, fn ({k, v}, acc) -> acc + @distance_weights[k] end)
    raw_distance = Enum.reduce(dist.penalties, 0.0, fn ({k, v}, acc) -> acc + v * @distance_weights[k] end)
    raw_distance / max_distance
  end

  def add_expr(dist, key, expr) do
    if expr do
      add_penalty(dist, key, 1.0)
    else
      add_penalty(dist, key, 0.0)
    end
  end

  def add_ratio(dist, key, number_1, nil) do
    add_penalty(dist, key, 0.0)
  end

  def add_ratio(dist, key, number_1, number_2) do
    number = min(number_1, number_2) |> max(0)
    add_penalty(dist, key, number / number_2)
  end

  def add_string(dist, key, nil, nil), do: add_penalty(dist, key, 0.0)
  def add_string(dist, key, string_1, string_2) when is_nil(string_1) or is_nil(string_2), do: add_penalty(dist, key, 0.0)

  def add_string(dist, key, string_1, string_2) do
    # string_1 = String.lowercase(string_1)
    # lowercase both strings

    # normalize string with 'the'

    # perform some subtittitions

    # calculate base distance
    # beets uses levenstein, but this is built in

    # add penalties for pattersn?

    # Cheat a bit
    add_penalty(dist, key, String.jaro_distance(string_1, string_2))
  end

  defp add_penalty(dist, key, penalty) do
    %Distance{dist | penalties: Map.put(dist.penalties, key, penalty)}
  end
end
