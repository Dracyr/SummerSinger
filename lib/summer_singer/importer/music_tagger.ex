defmodule SummerSinger.Importer.MusicTagger do

  def read(path) do
    with {:ok, data} <- exec_tagger(["read", path]) do
      if data["audio_properties"] do
        cover = read_cover(data["cover"])
        |> cover_fallback(path)

        {:ok, data["audio_properties"], data["tags"], cover}
      else
        {:error, "Could not parse file"}
      end
    end
  end

  def read_cover(nil), do: {:error, "No cover found"}
  def read_cover([picture | _pictures]) do
    with {:ok, image_data} <- Base.decode64(picture["picture_b64"]),
      do: {:ok, %{
        mime_type: picture["mime_type"],
        image: image_data,
        description: picture["description"],
        picture_type: picture["picture_type"]
      }}
  end

  @cover_titles ["cover", "front", "art", "album", "folder", "test"]
  def cover_fallback(cover, _) when elem(cover, 0) == :ok, do: elem(cover, 1)
  def cover_fallback(_, path) do
    image_path =
      Path.wildcard("#{Path.dirname(path)}/*.{jpg,jpeg,png}")
      |> Enum.filter(fn image -> Enum.member?(@cover_titles, image_title(image)) end)
      |> Enum.at(0)

    if image_path do
      %{
        mime_type: MIME.from_path(image_path),
        image: File.read!(image_path),
        description: nil,
        picture_type: nil
      }
    else
      nil
    end
  end

  defp exec_tagger(args) do
    with  res <- Porcelain.exec("music-tagger", args),
          {:ok, decode} <- Poison.decode(res.out),
        do: {:ok, decode}
  end

  defp image_title(image), do: Path.rootname(image) |> Path.basename
end
