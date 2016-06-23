defmodule SummerSinger.Image do
  use SummerSinger.Web, :model

  schema "images" do
    field :picture_type, :integer
    field :mime_type,    :string
    field :description,  :string
    field :file,         :binary

    belongs_to :track, SummerSinger.Track

    timestamps
  end

  @doc """
  Creates a changeset based on the `image` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(image, params \\ %{}) do
    image
    |> cast(params, [:picture_type, :mime_type, :description, :file])
    |> validate_required([:mime_type, :file])
  end
end
