defmodule GrooveLion.Track do
  use GrooveLion.Web, :model

  schema "tracks" do
    field :title, :string
    field :artist, :string
    field :filename, :string
    field :metadata, :map
    field :duration, :integer

    timestamps
  end

  @required_fields ~w(title artist filename duration)
  @optional_fields ~w(metadata)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def to_map(track, index) do
    to_map(track) |> Map.merge(%{index: index})
  end

  def to_map(track) do
     %{
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration
    }
  end
end
