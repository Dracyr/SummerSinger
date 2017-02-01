defmodule SummerSinger.CoverArt do
  use SummerSinger.Web, :model
  use Arc.Ecto.Schema

  schema "cover_art" do
    field :picture_type, :string
    field :mime_type,    :string
    field :description,  :string
    field :cover_art,    SummerSinger.CoverArt.Uploader.Type

    timestamps()
  end

  @doc """
  Creates a changeset based on the `cover_art` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(cover_art, params \\ %{}) do
    cover_art
    |> cast(params, [:picture_type, :mime_type, :description])
    |> cast_attachments(params, [:cover_art])
  end
end
