defmodule MetadataParser do

  def parse(file_name) do
    if String.contains?(file_name, ".mp3") do
      case File.read(file_name) do
        {:ok, binary} ->
          audio_data = case MPEGParser.parse_binary(binary) do
            {:ok, audio_data} ->
              audio_data
            {:error, _reason} ->
              nil
          end

          metadata = case ID3v2Parser.parse_binary(binary) do
            {:ok, metadata} ->
              metadata
            {:error, _reason} ->
              nil
          end

          if is_nil(audio_data) || is_nil(metadata) do
            {:err, "Error in reading metadata"}
          else
            {:ok, audio_data, metadata}
          end
        _ ->
          IO.puts("Couldn't open #{file_name}")
      end
    else
      IO.puts("Non mp3 file #{file_name}")
    end
  end
end
