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

  @required_fields ~w()
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
