defmodule GrooveLion.ID3v2 do

  @id3v2_tag_frame_names %{
    "AENC" => "Audio encryption",
    "APIC" => "Attached picture",
    "COMM" => "Comments",
    "COMR" => "Commercial frame",
    "ENCR" => "Encryption method registration",
    "EQUA" => "Equalization",
    "ETCO" => "Event timing codes",
    "GEOB" => "General encapsulated object",
    "GRID" => "Group identification registration",
    "IPLS" => "Involved people list",
    "LINK" => "Linked information",
    "MCDI" => "Music CD identifier",
    "MLLT" => "MPEG location lookup table",
    "OWNE" => "Ownership frame",
    "PRIV" => "Private frame",
    "PCNT" => "Play counter",
    # "POPM" => "Popularimeter",
    "POPM" => "Rating",
    "POSS" => "Position synchronisation frame",
    "RBUF" => "Recommended buffer size",
    "RVAD" => "Relative volume adjustment",
    "RVRB" => "Reverb",
    "SYLT" => "Synchronized lyric/text",
    "SYTC" => "Synchronized tempo codes",
    "TALB" => "Album/Movie/Show title",
    "TBPM" => "BPM (beats per minute)",
    "TCOM" => "Composer",
    "TCON" => "Content type",
    "TCOP" => "Copyright message",
    "TDAT" => "Date",
    "TDLY" => "Playlist delay",
    "TENC" => "Encoded by",
    "TEXT" => "Lyricist/Text writer",
    "TFLT" => "File type",
    "TIME" => "Time",
    "TIT1" => "Content group description",
    # "TIT2" => "Title/songname/content description",
    "TIT2" => "Title",
    "TIT3" => "Subtitle/Description refinement",
    "TKEY" => "Initial key",
    "TLAN" => "Language(s)",
    "TLEN" => "Length",
    "TMED" => "Media type",
    "TOAL" => "Original album/movie/show title",
    "TOFN" => "Original filename",
    "TOLY" => "Original lyricist(s)/text writer(s)",
    "TOPE" => "Original artist(s)/performer(s)",
    "TORY" => "Original release year",
    "TOWN" => "File owner/licensee",
    # "TPE1" => "Lead performer(s)/Soloist(s)",
    "TPE1" => "Artist",
    "TPE2" => "Band/orchestra/accompaniment",
    "TPE3" => "Conductor/performer refinement",
    "TPE4" => "Interpreted, remixed, or otherwise modified by",
    "TPOS" => "Part of a set",
    "TPUB" => "Publisher",
    "TRCK" => "Track number/Position in set",
    "TRDA" => "Recording dates",
    "TRSN" => "Internet radio station name",
    "TRSO" => "Internet radio station owner",
    "TSIZ" => "Size",
    "TSRC" => "ISRC (international standard recording code)",
    "TSSE" => "Software/Hardware and settings used for encoding",
    "TYER" => "Year",
    "TXXX" => "User defined text information frame",
    "UFID" => "Unique file identifier",
    "USER" => "Terms of use",
    "USLT" => "Unsychronized lyric/text transcription",
    "WCOM" => "Commercial information",
    "WCOP" => "Copyright/Legal information",
    "WOAF" => "Official audio file webpage",
    "WOAR" => "Official artist/performer webpage",
    "WOAS" => "Official audio source webpage",
    "WORS" => "Official internet radio station homepage",
    "WPAY" => "Payment",
    "WPUB" => "Publishers official webpage",
    "WXXX" => "User defined URL link frame"
  }

  def parse(<<
      "ID3",
      major_version  :: integer-size(8),
      minor_version  :: integer-size(8),
      _unsync      :: bits-size(1),
      _extended    :: bits-size(1),
      _exprm       :: bits-size(1),
      _flags       :: bits-size(5),
      safe_length :: bytes-size(4),
      data        :: binary >>) do

    # Extended header not handled

    length = unsync_int(safe_length)
    << frames :: binary-size(length), _audio_data :: binary >> = data

    metadata = %{
      tag_version: "ID3v2." <> Integer.to_string(major_version) <> "." <> Integer.to_string(minor_version),
      frames: frames
    }

    {:ok, metadata_frames(frames, metadata)}
  end

  def parse(_) do {:err, "Unknown tag type"} end

  defp metadata_frames(<<
      id     :: binary-size(4),
      length :: integer-size(32),
      _flags  :: bits-size(16),
      frame  :: binary-size(length),
      data   :: binary >>, metadata) do

    metadata = Map.merge(metadata, frame_data(id, frame))
    metadata_frames(data, metadata)
  end

  defp metadata_frames(_, metadata) do
    Map.delete(metadata, :frames)
  end

  defp frame_data("TXXX", <<
      _encoding :: size(8),
      data     :: binary >>) do

    null_index = Enum.find_index(to_char_list(data), fn(x) -> x == 0x00 end)
    << desc :: binary-size(null_index), _, content :: binary>> = data

    Map.put(%{}, desc, content)
  end

  defp frame_data("WXXX", <<
      _encoding :: size(8),
      data     :: binary >>) do

    null_index = Enum.find_index(to_char_list(data), fn(x) -> x == 0x00 end)
    << desc :: binary-size(null_index), _, content :: binary>> = data

    %{desc: desc, content: content}
  end

  defp frame_data("COMM", <<
    _encoding :: size(8),
    _language :: size(24),
    data     :: binary >>) do

    null_index = Enum.find_index(to_char_list(data), fn(x) -> x == 0x00 end)
    << desc :: binary-size(null_index), _, content :: binary>> = data
    %{desc: desc, text: content}
  end

  defp frame_data(id, data) do
    if Regex.match?(~r/[WT].../, id) do
      << 0x00, content :: binary >> = data
      tag_name = @id3v2_tag_frame_names[id]
      Map.put(%{}, tag_name, content)
    else
      Map.put(%{}, @id3v2_tag_frame_names[id], data)
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

    unsynced_int
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
