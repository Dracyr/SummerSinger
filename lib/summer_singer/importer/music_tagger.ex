defmodule SummerSinger.Importer.MusicTagger do

  def fetch_tags(path) do
    {:ok, data} = exec_tagger(["read", path])
    if data["audio_properties"] do
      {:ok, data["audio_properties"], data["tags"]}
    else
      {:error, "Could not parse file"}
    end
  end

  def fetch_cover(path) do
    cover =
      with  {:ok, [picture | _pictures]} <- exec_tagger(["read-cover", path]),
          {:ok, image_data} <- Base.decode64(picture["picture_b64"]),
        do: {:ok, %{
          mime_type: picture["mime_type"],
          image: image_data,
          description: picture["description"],
          picture_type: picture["picture_type"]
        }}

    case cover do
      {:ok, cover} when map_size(cover) == 4 -> {:ok, cover}
      _ -> cover_fallback(path)
    end
  end

  defp cover_fallback(path, cautious \\ true) do
    dir = Path.dirname(path)
    image_files = Path.wildcard("#{dir}/*.{jpg,jpeg,png}")
    image =
      if cautious do
        cautious_names = ["cover", "front", "art", "album", "folder"]

        image_files
        |> Enum.filter(fn image -> Enum.member?(cautious_names, image) end)
        |> Enum.at(0)
      else
        Enum.at(image_files, 0)
      end

    if image, do: image, else: {:error, "No cover found"}
  end

  defp exec_tagger(args) do
    with  res <- Porcelain.exec("music-tagger", args),
          {:ok, decode} <- Poison.decode(res.out),
          do: {:ok, decode}
  end
end
