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

  def find_or_create(name)
    when is_nil(name), do: nil
  def find_or_create(name) do
    try do
      Repo.transaction(fn ->
        case Repo.get_by(Artist, name: name) do
          nil ->
            %Artist{}
            |> Artist.changeset(%{name: name})
            |> Repo.insert!
          artist -> artist
        end
      end)
      |> case do
        {:ok, artist} ->
          artist
        {:error, _reason} ->
          find_or_create(name)
      end
    rescue
      _e in Ecto.InvalidChangesetError ->
        find_or_create(name)
    end
  end
end
