defmodule GrooveLion.ID3v2 do

  def parse(<<
      "ID3",
      major_version  :: integer-size(8),
      minor_version  :: integer-size(8),
      unsync      :: bits-size(1),
      extended    :: bits-size(1),
      exprm       :: bits-size(1),
      flags       :: bits-size(5),
      safe_length :: bytes-size(4),
      data        :: binary >>) do

    # Extended header not handled

    {:ok, length} = unsync_int(safe_length)
    << frames :: binary-size(length), audio_data :: binary >> = data

    metadata = %{
      tag_version: "ID3v2." <> Integer.to_string(major_version) <> "." <> Integer.to_string(minor_version),
      unsync: unsync == 1,
      extended: extended == 1,
      experimental: exprm == 1,
      frames: frames
    }

    {:ok, metadata_frames(frames, metadata)}
  end

  def parse(_) do {:err, "Unknown tag type"} end

  defp metadata_frames(<<
      id     :: binary-size(4),
      length :: integer-size(32),
      flags  :: bits-size(16),
      frame  :: binary-size(length),
      data   :: binary >>, metadata) do

    metadata = Map.merge(metadata, frame_data(id, frame))
    metadata_frames(data, metadata)
  end

  defp metadata_frames(_, metadata) do
    Map.delete(metadata, :frames)
  end

  defp frame_data("TXXX", <<
      encoding :: size(8),
      data     :: binary >>) do

    null_index = Enum.find_index(to_char_list(data), fn(x) -> x == 0x00 end)
    << desc :: binary-size(null_index), _, content :: binary>> = data

    Map.put(%{}, desc, content)
  end

  defp frame_data("WXXX", <<
      encoding :: size(8),
      data     :: binary >>) do

    null_index = Enum.find_index(to_char_list(data), fn(x) -> x == 0x00 end)
    << desc :: binary-size(null_index), _, content :: binary>> = data

    %{encoding: encoding, desc: desc, content: content}
  end

  defp frame_data("COMM", <<
    encoding :: size(8),
    language :: size(24),
    data     :: binary >>) do

    null_index = Enum.find_index(to_char_list(data), fn(x) -> x == 0x00 end)
    << desc :: binary-size(null_index), _, content :: binary>> = data
    %{encoding: encoding, desc: desc, text: content}
  end

  defp frame_data(id, data) do
    if Regex.match?(~r/[WT].../, id) do
      << 0x00, content :: binary >> = data
      case id do
        "TIT2" -> %{title: content}
        "TPE1" -> %{artist: content}
        "TYER" -> %{year: content}
        _ -> Map.put(%{}, id, content)
      end
    else
      %{}
    end
  end

  def unsync_int(<<
        0 :: size(1), byte_1 :: size(7),
        0 :: size(1), byte_2 :: size(7),
        0 :: size(1), byte_3 :: size(7),
        0 :: size(1), byte_4 :: size(7) >>) do

    << unsynced_int :: integer-size(28) >> = <<
      byte_1 :: size(7),
      byte_2 :: size(7),
      byte_3 :: size(7),
      byte_4 :: size(7) >>
    # IO.inspect(unsynced_int)
    {:ok, unsynced_int}
  end

  def unsync_int(_) do
    {:err}
  end
end

# File.read!("/home/dracyr/test.mp3") |> ID3v2.parse
#File.read!(System.argv) |> ID3v2.parse |> IO.inspect
# mp3 frame header
#<<
#  frame_sync :: bits-size(11),
#  version :: bits-size(2),
#  layer :: bits-size(2),
#  protection :: bits-size(1),
#  bitrate :: bits-size(4),
#  sampling :: bits-size(2),
#  padding :: bits-size(1),
#  private :: bits-size(1),
#  channel :: bits-size(2),
#  extension :: bits-size(2),
#  copyright :: bits-size(1),
#  original :: bits-size(1),
#  empasis :: bits-size(2) >>
