defmodule SummerSinger.Artist do
  use SummerSinger.Web, :model
  alias SummerSinger.Artist

  schema "artists" do
    field :name, :string, unique: true

    has_many :albums, SummerSinger.Album
    has_many :tracks, SummerSinger.Track
    has_many :album_tracks, through: [:albums, :tracks]

    timestamps
  end

  @required_fields ~w(name)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:name)
  end

  def find_or_create(nil), do: nil
  def find_or_create(name) do
    case Repo.get_by(Artist, name: name) do
      nil ->
        try do
          %SummerSinger.Artist{}
          |> Artist.changeset(%{name: name})
          |> Repo.insert!
        rescue
          e in Ecto.InvalidChangesetError ->
            raise "Artist already created!"
        end
      artist -> artist
    end
  end
end
