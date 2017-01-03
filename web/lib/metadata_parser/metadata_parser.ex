defmodule MetadataParser do

  def parse(file_name) do
    port = Port.open({:spawn, "tagreader read \"#{file_name}\""}, [:binary, line: 65_536])

    data =
      receive do
        {^port, {:data, {:eol, result}}} ->
          Poison.decode!(result)
      after
        10_000 -> nil
      end

    if data["audio_properties"] do
      {:ok, data["audio_properties"], data["tags"]}
    else
      {:error, "Could not parse file"}
    end
  end
end
