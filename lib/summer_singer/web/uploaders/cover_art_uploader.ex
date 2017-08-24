defmodule SummerSinger.CoverArt.Uploader do
  use Arc.Definition
  use Arc.Ecto.Definition

  def __storage, do: Arc.Storage.Local

  @versions [:original, :small]

  # Whitelist file extensions:
  def validate({file, _}) do
    ~w(.jpg .jpeg .gif .png) |> Enum.member?(Path.extname(file.file_name))
  end

  # Define a thumbnail transformation:
  def transform(:small, _) do
    {:convert, "-strip -thumbnail 150x150^ -gravity center -extent 150x150 -format png", :png}
  end

  def filename(version, {_file, scope}) do
    "#{scope.id}_#{version}"
  end

  def storage_dir(_version, {_file, scope}) do
    "uploads/cover_art/#{div(scope.id, 1000)}"
  end

  # Provide a default URL if there hasn't been a file uploaded
  # def default_url(version, scope) do
  #   "/images/avatars/default_#{version}.png"
  # end

  # Specify custom headers for s3 objects
  # Available options are [:cache_control, :content_disposition,
  #    :content_encoding, :content_length, :content_type,
  #    :expect, :expires, :storage_class, :website_redirect_location]
  #
  # def s3_object_headers(version, {file, scope}) do
  #   [
  #     content_type: Plug.MIME.path(file.file_name),
  #     cache_control: "public, hej"
  #   ]
  # end
end
