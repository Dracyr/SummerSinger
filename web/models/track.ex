defmodule SummerSinger.Track do
  use SummerSinger.Web, :model
  alias SummerSinger.{Track, Album, Artist}

  schema "tracks" do
    field :title,    :string
    field :filename, :string
    field :metadata, :map
    field :duration, :float, null: false
    field :rating,   :integer

    belongs_to :artist, SummerSinger.Artist
    belongs_to :album,  SummerSinger.Album
    belongs_to :folder, SummerSinger.Folder
    has_many   :images, SummerSinger.Image

    has_many   :playlist_items, SummerSinger.PlaylistItem
    has_many   :playlists, through: [:playlist_items, :playlist]

    timestamps
  end

  @required_fields ~w(title filename duration folder)
  @optional_fields ~w(rating metadata)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:filename)
  end

  def to_map(track, index) do
    to_map(track) |> Map.merge(%{index: index})
  end

  def to_map(track) do
     %{
      id: track.id,
      title: track.title,
      artist: track.artist && track.artist.name,
      album: track.album && track.album.title,
      duration: track.duration,
      rating: track.rating
    }
  end

  def filename_exists?(filename) do
    case Repo.get_by(__MODULE__, filename: filename) do
      nil -> false
      _   -> true
    end
  end

  def search(search_term) do
    search(Track, search_term) |> Repo.all
  end

  def search(query, search_term, limit \\ 0.25) do
    from track in query,
    where: fragment("similarity(?,?) > ?", track.title, ^search_term, ^limit),
    order_by: fragment("similarity(?,?) DESC", track.title, ^search_term)
  end

  def order_by(query, "title", dir) when dir == "asc" do
    from t in query,
    order_by: [asc: t.title]
  end
  def order_by(query, "title", dir) when dir == "desc" or is_nil(dir) do
    from t in query,
    order_by: [desc: t.title]
  end

  def order_by(query, "artist", dir) when dir == "asc" do
    from t in query,
    join: a in Artist, on: t.artist_id == a.id,
    order_by: [asc: a.name, asc: t.title]
  end
  def order_by(query, "artist", dir) when dir == "desc" or is_nil(dir) do
    from t in query,
    join: a in Artist, on: t.artist_id == a.id,
    order_by: [desc: a.name, desc: t.title]
  end

  def order_by(query, "album", dir) when dir == "asc" do
    from t in query,
    join: a in Album, on: t.album_id == a.id,
    order_by: [asc: a.title, asc: t.title]
  end
  def order_by(query, "album", dir) when dir == "desc" or is_nil(dir) do
    from t in query,
    join: a in Album, on: t.album_id == a.id,
    order_by: [desc: a.title, desc: t.title]
  end

  def order_by(query, "rating", dir) when dir == "asc" do
    from t in query,
    order_by: fragment("rating ASC NULLS LAST")
  end
  def order_by(query, "rating", dir) when dir == "desc" or is_nil(dir) do
    from t in query,
    order_by: fragment("rating DESC NULLS LAST")
  end
end
