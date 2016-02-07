defmodule SummerSinger.Playlist do
  use SummerSinger.Web, :model

  schema "playlists" do
    field :title, :string

    has_many :playlist_items, SummerSinger.PlaylistItem
    has_many :tracks, through: [:playlist_items, :track]

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
