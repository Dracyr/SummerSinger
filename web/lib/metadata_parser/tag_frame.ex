defmodule ID3v2Parser.TagFrame do
  defmacro valid_encoding(encoding) do
    quote do
      unquote(encoding) == 0 or
      unquote(encoding) == 1 or
      unquote(encoding) == 2 or
      unquote(encoding) == 3
    end
  end

  def tag_frame("TXXX", <<
      encoding :: integer-size(8),
      data      :: binary >>) when valid_encoding(encoding) do

    {desc, content} = split_at_null(data)
    Map.put(%{}, desc, to_utf8(content, encoding))
  end
  def tag_frame("TXXX", _data), do: %{}

  def tag_frame("WXXX", <<
      encoding :: integer-size(8),
      data      :: binary >>) when valid_encoding(encoding) do

    {desc, content} = split_at_null(data)
    Map.put(%{}, desc, content)
  end
  def tag_frame("WXXX", _data), do: %{}

  def tag_frame("TCON", <<
      encoding :: integer-size(8),
      data     :: binary >>) when valid_encoding(encoding) do

    genres = data
    |> to_utf8(encoding)
    |> to_char_list
    |> Enum.chunk_by(&(&1 == 0))
    |> Enum.reject(&(&1 == [0]))

    Map.put(%{}, "TCON", genres)
  end
  def tag_frame("TCON", _data), do: %{}

  def tag_frame("POPM", data) do
    { _user, << rating :: integer-size(8), _counter :: binary >>} = split_at_null(data)
    Map.put(%{}, "POPM", rating)
  end

  def tag_frame("COMM", <<
    encoding :: integer-size(8),
    _language :: size(24),
    data      :: binary >>) when valid_encoding(encoding) do

    {desc, content} = split_at_null(data)
    %{desc: to_utf8(desc, encoding), text: to_utf8(content, encoding)}
  end
  def tag_frame("COMM", _data), do: %{}

  @picture_type %{
    00 => "Other",
    01 => "32x32 pixels 'file icon' (PNG only)",
    02 => "Other file icon",
    03 => "Cover (front)",
    04 => "Cover (back)",
    05 => "Leaflet page",
    06 => "Media (e.g. lable side of CD)",
    07 => "Lead artist/lead performer/soloist",
    08 => "Artist/performer",
    09 => "Conductor",
    10 => "Band/Orchestra",
    11 => "Composer",
    12 => "Lyricist/text writer",
    13 => "Recording Location",
    14 => "During recording",
    15 => "During performance",
    16 => "Movie/video screen capture",
    17 => "A bright coloured fish",
    18 => "Illustration",
    19 => "Band/artist logotype",
    20 => "Publisher/Studio logotype"
  }

  def tag_frame("APIC", <<
      encoding :: integer-size(8),
      data :: binary >>) when valid_encoding(encoding) do

    { mime_type, << picture_type :: integer-size(8), desc_data :: binary >> } = split_at_null(data)
    { description, picture_data } = split_at_null(desc_data)

    apic = %{type: @picture_type[picture_type], mime: mime_type, desc: description, file: picture_data}
    Map.put(%{}, "APIC", [apic])
  end
  def tag_frame("APIC", _data), do: %{}

  def tag_frame(id, data) do
    cond do
      Regex.match?(~r/[WT].../, id) ->
        # Some tracks try to encode multiples of data in a null-separated list
        text = to_utf8(data) |> split_at_null |> elem(0)
        Map.put(%{}, id, text)
      true ->
        Map.put(%{}, id, data)
    end
  end

  defp split_at_null(binary) do
    case :binary.match(binary, << 0 >>) do
      {index , _length} ->
        << head :: bytes-size(index), 0x00, tail :: binary >> = binary
        { head, tail }
      :nomatch ->
        { binary }
    end
  end

  defp to_utf8(<< encoding :: integer-size(8), string :: bytes >>), do: to_utf8(string, encoding)
  defp to_utf8(<< _invalid_text :: bytes >>), do: raise ID3v2Parser.TagFrameError, "invalid encoding"
  defp to_utf8(string, encoding) do
    case encoding do
      0 -> # ISO-8859-1
        Codepagex.to_string!(string, :iso_8859_1)
      1 -> # UCS-2 (UTF-16 with BOM)
        :unicode.characters_to_binary(string, elem(:unicode.bom_to_encoding(string), 0))
      2 -> #UTF-16BE encoded Unicode without BOM
        :unicode.characters_to_binary(string, {:utf16, :big})
      3 -> # Good old UTF-8
        string
      _ -> # No valid encoding, why are you doing this.
        raise ID3v2Parser.TagFrameError, "invalid encoding"
    end
  end
end

defmodule ID3v2Parser.TagFrameError do
  defexception [:message]
  def exception(value) do
    %ID3v2Parser.TagFrameError{message: "invalid id3v2 frame, #{value}"}
  end
end
