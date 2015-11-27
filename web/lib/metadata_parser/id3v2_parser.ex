defmodule ID3v2Parser do
  alias ID3v2Parser.TagFrame

  def parse_binary(binary) do
    case parse_header(binary) do
      {:ok, header_info} ->
        length = header_info[:length]
        <<
          _header     :: binary-size(10),
          tag_frames  :: binary-size(length),
          _audio_data :: binary >> = binary

          {:ok, metadata_frames(tag_frames, %{})}
      _ ->
        {:no_tag, :id3v2}
    end
  end

  def parse_header(<<
      "ID3",
      major_version  :: integer-size(8),
      minor_version  :: integer-size(8),
      _unsync        :: bits-size(1), # Unsynchronisation scheme not handled
      _extended      :: bits-size(1), # Extended header not handled yet
      _experimental  :: bits-size(1),
      _flags         :: bits-size(5),
      safe_length    :: bytes-size(4),
      _data          :: binary >>) do

    {:ok, %{
      tag_version: "ID3v2." <> Integer.to_string(major_version) <> "." <> Integer.to_string(minor_version),
      length: unsync_int(safe_length)
    }}
  end
  def parse_header(_), do: {:no_tag, :id3v2}

  defp metadata_frames(<<
      id     :: binary-size(4),
      length :: integer-size(32),
      _flags :: bits-size(16),
      frame  :: binary-size(length),
      binary :: binary >>, metadata) do
    metadata_frames(binary, Map.merge(metadata, TagFrame.tag_frame(id, frame)))
  end
  defp metadata_frames(_, metadata), do: metadata

  defp unsync_int(<<
      0 :: size(1), byte_1 :: size(7),
      0 :: size(1), byte_2 :: size(7),
      0 :: size(1), byte_3 :: size(7),
      0 :: size(1), byte_4 :: size(7) >>) do

    << unsynced_int :: integer-size(28) >> = <<
      byte_1 :: size(7),
      byte_2 :: size(7),
      byte_3 :: size(7),
      byte_4 :: size(7) >>

    unsynced_int
  end
end
