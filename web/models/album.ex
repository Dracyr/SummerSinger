defmodule GrooveLion.Album do
  use GrooveLion.Web, :model

  schema "albums" do
    field :title, :string
    field :year,  :string

    belongs_to :artist, GrooveLion.Artist
    has_many   :tracks, GrooveLion.Track

    timestamps
  end

  @required_fields ~w(title)
  @optional_fields ~w(year)

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
