defmodule MetadataParser.Cover do
  defstruct mime_type: nil, picture: nil, description: nil, picture_type: nil

  def fetch!(path) do
    # TODO: Fallback to reading cover.jpg
    [picture | _pictures] = Porcelain.exec("tagreader", ["read-cover", path])
    |> Map.fetch!(:out)
    |> Poison.decode!
    %{
      "mime_type" => mime_type,
      "picture_b64" => picture_b64,
      "description" => desc,
      "picture_type" => type,
    } = picture

    {:ok, data} = Base.decode64(picture_b64)

    %MetadataParser.Cover{
      mime_type: mime_type,
      picture: data,
      description: desc,
      picture_type: type
    }
  end
end
