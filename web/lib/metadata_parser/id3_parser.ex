defmodule ID3Parser do

  @id3_tag_size 128

  def parse_binary(binary) when byte_size(binary) > @id3_tag_size do
    mp3_byte_size = (byte_size(binary) - @id3_tag_size)
    << _ :: binary-size(mp3_byte_size), id3_tag :: binary >> = binary

    parse_id3(id3_tag)
  end

  def parse_binary(_binary), do: {:no_tag, :id3}

  defp parse_id3(<< "TAG",
      title   :: binary-size(30),
      artist  :: binary-size(30),
      album   :: binary-size(30),
      year    :: binary-size(4),
      comment :: binary-size(30),
      _rest   :: binary >>
    ) do

    {:ok, %{
      title: strip_null(title),
      artist: strip_null(artist),
      album: strip_null(album),
      year: strip_null(year),
      comment: strip_null(comment)
    }}
  end

  defp parse_id3(_), do: {:no_tag, :id3}

  defp strip_null(binary) do
    :binary.split(binary, [<< 0 >>]) |> Enum.at(0)
  end
end
