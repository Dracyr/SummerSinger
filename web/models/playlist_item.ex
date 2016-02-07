defmodule SummerSinger.PlaylistItem do
  use SummerSinger.Web, :model

  schema "playlist_items" do
    field :title, :string
    belongs_to :playlist, SummerSinger.Playlist
    belongs_to :track, SummerSinger.Track

    timestamps
  end

  @required_fields ~w(title)
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
