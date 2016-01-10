defmodule GrooveLion.Artist do
  use GrooveLion.Web, :model

  schema "artists" do
    field :name, :string

    has_many :albums, GrooveLion.Album
    has_many :tracks, GrooveLion.Track
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
  end

  def find_or_create(nil), do: nil
  def find_or_create(name) do
    case Repo.get_by(Artist, name: name) do
      nil ->
        %GrooveLion.Artist{}
        |> Artist.changeset(%{name: name})
        |> Repo.insert!
      artist -> artist
    end
  end
end
