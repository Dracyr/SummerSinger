defmodule SummerSinger.Album do
  use SummerSinger.Web, :model

  schema "albums" do
    field :title
    field :year

    belongs_to :artist,    SummerSinger.Artist
    belongs_to :cover_art, SummerSinger.CoverArt
    has_many   :tracks,    SummerSinger.Track

    timestamps
  end

  @doc """
  Creates a changeset based on the `album` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(album, params \\ %{}) do
    album
    |> cast(params, [:title, :year, :artist_id, :cover_art_id])
    |> validate_required([:title, :artist_id])
    |> unique_constraint(:title, name: :albums_title_artist_id_index)
  end
end
