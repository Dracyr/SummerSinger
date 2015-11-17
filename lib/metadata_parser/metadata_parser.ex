defmodule MetadataParser do

  @parsers [
    ID3Parser,
    ID3v2Parser,
    MPEGParser
  ]

  def parse(file_name) do
    case File.read(file_name) do
      {:ok, binary} ->
        ID3Parser.parse_binary(binary)
      _ ->
        IO.puts("Couldn't open #{file_name}")
    end
  end
end
