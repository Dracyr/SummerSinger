defmodule ID3v2Parser.TagFrame do

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
  def tag_frame("TXXX", <<
      _encoding :: size(8),
      data      :: binary >>) do

    null_index = find_null_index data
    << desc :: binary-size(null_index), _null_marker, content :: binary>> = data

    Map.put(%{}, desc, content)
  end

  def tag_frame("TCON", data) do
    << 0x00, content :: binary >> = data
    genres = Enum.chunk_by(to_char_list(content), &(&1 == 0))
    |> Enum.reject(&(&1 == [0]))

    Map.put(%{}, @id3v2_tag_frame_names["TCON"], genres)
  end

  def tag_frame("POPM", data) do
    null_index = find_null_index data
    <<
      _user    :: bytes-size(null_index),
      _null_marker,
      rating   :: integer-size(8),
      _counter :: binary >> = data

    Map.put(%{}, @id3v2_tag_frame_names["POPM"], rating)
  end

  def tag_frame("COMM", <<
    _encoding :: size(8),
    _language :: size(24),
    data      :: binary >>) do

    null_index = find_null_index data
    << desc :: binary-size(null_index), _, content :: binary>> = data

    %{desc: desc, text: content}
  end

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

  def tag_frame("APIC", << _encoding :: size(8), data :: binary >>) do
    null_index = find_null_index data
    <<
      mime_type :: bytes-size(null_index),
      _null,
      picture_type :: integer-size(8),
      desc_data :: binary >> = data

    null_index = find_null_index desc_data
    << description :: bytes-size(null_index), _null, picture_data :: binary >> = desc_data

    apic = %{type: @picture_type[picture_type], mime: mime_type, desc: description, file: picture_data}
    Map.put(%{}, @id3v2_tag_frame_names["APIC"], apic)
  end

  def tag_frame(id, data) do
    cond do
      Regex.match?(~r/[WT].../, id) ->
        case data do
            << 0x00, content :: binary >> ->
                Map.put(%{}, @id3v2_tag_frame_names[id], content)
            << content :: binary >> ->
                Map.put(%{}, @id3v2_tag_frame_names[id], content)
        end
      true ->
        Map.put(%{}, @id3v2_tag_frame_names[id], data)
    end
  end

  defp find_null_index(binary) do
    Enum.find_index(:erlang.binary_to_list(binary), &(&1 == 0))
  end
end
