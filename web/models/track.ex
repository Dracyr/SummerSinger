defmodule GrooveLion.Track do
  use GrooveLion.Web, :model

  schema "tracks" do
    field :title, :string
    field :artist, :string
    field :filename, :string

    timestamps
  end

  @required_fields ~w(title artist)
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
