defmodule SummerSinger.Album do
  use SummerSinger.Web, :model
  alias SummerSinger.Album

  schema "albums" do
    field :title, :string
    field :year,  :string

    belongs_to :artist, SummerSinger.Artist
    has_many   :tracks, SummerSinger.Track

    timestamps
  end

  @required_fields ~w(title artist_id)
  @optional_fields ~w(year)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:title, name: :albums_title_artist_id_index)
  end

  def find_or_create(nil, _), do: nil
  def find_or_create(nil, nil), do: nil
  def find_or_create(title, artist) do
    try do
      transaction = Repo.transaction(fn ->
        album = Repo.one from a in Album,
          where: a.title == ^title and a.artist_id == ^artist.id

        if is_nil(album) do
          %Album{}
          |> Album.changeset(%{title: title, artist_id: artist.id})
          |> Repo.insert!
        else
          album
        end
      end)

      case transaction do
        {:ok, artist} ->
          artist
        {:error, _reason} ->
          find_or_create(title, artist)
      end
    rescue
      e in Ecto.InvalidChangesetError ->
        find_or_create(title, artist)
    end
  end
end
