defmodule SummerSinger.Artist do
  use SummerSinger.Web, :model

  schema "artists" do
    field :name, :string, unique: true

    has_many :albums, SummerSinger.Album
    has_many :tracks, SummerSinger.Track
    has_many :album_tracks, through: [:albums, :tracks]

    timestamps
  end

  @doc """
  Creates a changeset based on the `artist` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(artist, params \\ %{}) do
    artist
    |> cast(params, [:name])
    |> validate_required(:name)
    |> unique_constraint(:name)
  end
end
