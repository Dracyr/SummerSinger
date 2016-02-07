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

  @required_fields ~w(title)
  @optional_fields ~w(year)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def find_or_create(nil, _), do: nil
  def find_or_create(title, artist) do
    album = Repo.one(
          from a in Album,
          where: a.title == ^title and a.artist_id == ^artist.id)

    case album do
      nil ->
        %SummerSinger.Album{}
        |> Album.changeset(%{title: title, artist_id: artist.id})
        |> Repo.insert!
      album -> album
    end
  end
end
