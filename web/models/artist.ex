defmodule SummerSinger.Artist do
  use SummerSinger.Web, :model
  alias SummerSinger.Artist
  require IEx
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
    try do
      transaction = Repo.transaction(fn ->
        case Repo.get_by(Artist, name: name) do
          nil ->
            %Artist{}
            |> Artist.changeset(%{name: name})
            |> Repo.insert!
          artist -> artist
        end
      end)

      case transaction do
        {:ok, artist} ->
          artist
        {:error, _reason} ->
          find_or_create(name)
      end
    rescue
      e in Ecto.InvalidChangesetError ->
        find_or_create(name)
    end
  end
end
