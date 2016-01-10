defmodule MPEGParser do

  @mpeg_version %{
    0 => "MPEG Version 2.5",
    1 => "Reserved",
    2 => "MPEG Version 2",
    3 => "MPEG Version 1"
  }

  @layer_description %{
    0 => "Reserved",
    1 => "Layer III",
    2 => "Layer II",
    3 => "Layer I"
  }

  @bitrate_index %{
    # 0  => ["free",  "free",  "free",  "free",  "free"],
    1  => [32,  32,  32,  32,  8],
    2  => [64,  48,  40,  48,  16],
    3  => [96,  56,  48,  56,  24],
    4  => [128, 64,  56,  64,  32],
    5  => [160, 80,  64,  80,  40],
    6  => [192, 96,  80,  96,  48],
    7  => [224, 112, 96,  112, 56],
    8  => [256, 128, 112, 128, 64],
    9  => [288, 160, 128, 144, 80],
    10 => [320, 192, 160, 160, 96],
    11 => [352, 224, 192, 176, 112],
    12 => [384, 256, 224, 192, 128],
    13 => [416, 320, 256, 224, 144],
    14 => [448, 384, 320, 256, 160]
    # 15 => ["bad", "bad", "bad", "bad", "bad"]
  }

  @sampling_index %{
    0 => [44100, 22050, 11025],
    1 => [48000, 24000, 12000],
    2 => [32000, 16000, 8000]
    # 3 => ["Reserved", "Reserved", "Reserved"]
  }

  @channel_mode %{
    0 => "Stereo",
    1 => "Joint stereo (Stereo)",
    2 => "Dual channel (2 mono channels)",
    3 => "Single channel (Mono)"
  }

  def parse_binary(binary) do
    case ID3v2Parser.parse_header(binary) do
      {:ok, header_info} ->
        length = header_info[:length]
        << _header     :: binary-size(10),
          _tag_frames  :: binary-size(length),
          audio_data   :: binary >> = binary

          {frame_offset, 1} = :binary.match(audio_data, [<< 0xFFF >>])
          << _offset     :: bytes-size(frame_offset),
            frame_header :: bytes-size(4),
            _binary      :: binary >> = audio_data

          frame_header = parse_frame_header(frame_header)
          duration = get_duration(frame_header[:bitrate], byte_size(binary), audio_data)

          {:ok, Map.merge(frame_header, %{duration: duration})}
      _ ->
        {:err}
    end
  end

  defp get_duration(bitrate, file_size, audio_data) do
    cond do
      # Should be on byte 36 in first frame
      :nomatch != :binary.match(audio_data, [<< "Xing" >>]) ->
        raise "VBR FILE, implement duration"
      :nomatch != :binary.match(audio_data, [<< "VBRI" >>]) ->
        raise "VBR FILE, implement duration"
      true -> # CBR File
        file_size / (bitrate * 1000 / 8)
    end
  end

  def parse_frame_header(<<
    _frame_sync :: bits-size(11),
    version     :: integer-size(2),
    layer       :: integer-size(2),
    _protection :: bits-size(1),
    bitrate     :: integer-size(4),
    samplerate  :: integer-size(2),
    _padding    :: bits-size(1),
    _private    :: bits-size(1),
    channel     :: integer-size(2),
    _extension  :: bits-size(2),
    _copyright  :: bits-size(1),
    _original   :: bits-size(1),
    _empasis    :: bits-size(2) >>) do

    %{
      encoding: @mpeg_version[version] <> " " <> @layer_description[layer],
      bitrate: parse_bitrate(bitrate, @mpeg_version[version], @layer_description[layer]),
      samplerate: parse_samplerate(samplerate, @mpeg_version[version]),
      channel: @channel_mode[channel]
    }
  end

  def parse_bitrate(bitrate_index, version, layer) do
    @bitrate_index[bitrate_index] |> Enum.at(
      case {version, layer} do
        {"MPEG Version 1", "Layer I"}     -> 0
        {"MPEG Version 1", "Layer II"}    -> 1
        {"MPEG Version 1", "Layer III"}   -> 2

        {"MPEG Version 2",   "Layer I"}   -> 3
        {"MPEG Version 2.5", "Layer I"}   -> 3

        {"MPEG Version 2",   "Layer II"}  -> 4
        {"MPEG Version 2.5", "Layer II"}  -> 4
        {"MPEG Version 2",   "Layer III"} -> 4
        {"MPEG Version 2.5", "Layer III"} -> 4
      end)
  end

  def parse_samplerate(sampling_index, version) do
    @sampling_index[sampling_index] |> Enum.at(
      case {version} do
        {"MPEG Version 1"}   -> 0
        {"MPEG Version 2"}   -> 1
        {"MPEG Version 2.5"} -> 2
      end)
  end
end
