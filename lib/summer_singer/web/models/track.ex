defmodule SummerSinger.Track do
  use SummerSinger.Web, :model

  schema "tracks" do
    field :title,    :string
    field :path, :string
    field :metadata, :map
    field :duration, :float, null: false
    field :rating,   :integer
    field :inbox,    :boolean
    field :imported, :boolean

    belongs_to :artist,  SummerSinger.Artist
    belongs_to :album,   SummerSinger.Album
    belongs_to :folder,  SummerSinger.Folder
    belongs_to :cover_art,   SummerSinger.CoverArt

    has_many   :playlist_items, SummerSinger.PlaylistItem
    has_many   :playlists, through: [:playlist_items, :playlist]

    timestamps()
  end

  @allowed_fields ~w(
    title path metadata duration rating artist_id album_id folder_id
    inbox cover_art_id imported
  )

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(track, params \\ %{}) do
    track
    |> cast(params, @allowed_fields)
    |> validate_required([:path])
    |> unique_constraint(:path)
  end

  def to_map(track, index) do
    to_map(track) |> Map.merge(%{index: index})
  end

  def to_map(track) do
     %{
      id: track.id,
      title: track.title || Path.basename(track.path),
      artist: track.artist && track.artist.name,
      album: track.album && track.album.title,
      path: Path.basename(track.path),
      duration: track.duration,
      rating: track.rating
    }
  end

  def order_by(query, "title", dir) when dir in ["asc", "desc", nil] do
    from t in query,
    order_by: [{^String.to_atom(dir || "desc"), t.title}]
  end

  def order_by(query, "artist", dir) when dir in ["asc", "desc", nil] do
    dir = String.to_atom(dir || "desc")
    from t in query,
    join: a in Artist, on: t.artist_id == a.id,
    order_by: [{^dir, a.name}, {^dir, t.title}]
  end

  def order_by(query, "album", dir) when dir in ["asc", "desc", nil] do
    dir = String.to_atom(dir || "desc")
    from t in query,
    join: a in Album, on: t.album_id == a.id,
    order_by: [{^dir, a.title}, {^dir, t.title}]
  end

  def order_by(query, "rating", dir) when dir == "asc" do
    from t in query,
    order_by: fragment("rating ASC NULLS LAST")
  end
  def order_by(query, "rating", dir) when dir == "desc" or is_nil(dir) do
    from t in query,
    order_by: fragment("rating DESC NULLS LAST")
  end

  def search(search_term) do
    search(Track, search_term) |> Repo.all
  end

  def search(query, search_term, limit \\ 0.25) do
    from track in query,
      where:
        fragment("unaccent(?) ILIKE unaccent(?)", track.title, ^"%search_term%")
        or
        fragment("similarity(?,?) > ?", track.title, ^search_term, ^limit),
      order_by: fragment("similarity(?,?) DESC", track.title, ^search_term)
  end
end
