defmodule Importer.Distance do
  defstruct [
    items: %{}
  ]

  def track_length(dist, %{length: item_length}, %AutoTagger.TrackInfo{length: track_length}) do
    diff = abs(item_length - track_length) # - some magic number
    add_ratio(dist, "track_length", diff, 10) # 10 is also some magic number
  end

  # check so that artist exists
  def artist(dist, item, track_info) do
    # also check so that aritist is not in VA artists

    add_string(dist, "track_artist", item.artist, track_info.artist)
  end

  def track_index(dist, item, track_info) do
    add_expr(dist, "track_index", track_info.index && item.index  && !(item.track not in [track_info.medium_index, track_info.index]))
  end

  def track_id(dist, item, track_info) do
    add_expr(dist, "track_id", item.track_id != track_info.track_id)
  end

  def track_distance(item, track_info) do
    %Importer.Distance{}
    |> track_length(item, track_info)
    |> add_string("track_title", item.title, track_info.title)
    |> artist(item, track_info)
    |> track_index(item, track_info)
    |> track_id(item, track_info)
  end

  def calculate(dist) do

  end

  def add_expr(dist, key, expr) do
    if expr do
      Map.put(dist, key, 1.0)
    else
      Map.put(dist, key, 0.0)
    end
  end

  def add_ratio(dist, key, number_1, nil) do
    Map.put(dist, key, 0.0)
  end

  def add_ratio(dist, key, number_1, number_2) do
    number = min(number_1, number_2) |> max(0)
    Map.put(dist, key, number / number_2)
  end

  def add_string(_, _, nil, nil), do: 0.0
  def add_string(_, _, string_1, string_2) when is_nil(string_1) or is_nil(string_2), do: 1.0

  def add_string(dist, key, string_1, string_2) do
    # string_1 = String.lowercase(string_1)
    # lowercase both strings

    # normalize string with 'the'

    # perform some subtittitions

    # calculate base distance
    # beets uses levenstein, but this is built in

    # add penalties for pattersn?

    # Cheat a bit
    String.jaro_distance(string_1, string_2)
  end
end
