defmodule MetadataParser do

  def parse(file_name) do
    if String.contains?(file_name, ".mp3") do
      case File.read(file_name) do
        {:ok, binary} ->
          {:ok, audio_data} = MPEGParser.parse_binary(binary)
          {:ok, metadata}  = ID3v2Parser.parse_binary(binary)

          {:ok, audio_data, metadata}
        _ ->
          IO.puts("Couldn't open #{file_name}")
      end
    else
      IO.puts("Non mp3 file #{file_name}")
    end
  end
end
