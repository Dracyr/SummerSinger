defmodule SummerSinger.Playlist do
  use SummerSinger.Web, :model
  alias SummerSinger.{Playlist, PlaylistItem, Repo, Track}

  schema "playlists" do
    field :title, :string
    field :path, :string

    has_many :playlist_items, SummerSinger.PlaylistItem
    has_many :tracks, through: [:playlist_items, :track]

    timestamps
  end

  @required_fields ~w(title path)
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

  def create(playlist_path, root_path) do
    playlist = Repo.insert!(%Playlist{
      path: Path.absname(playlist_path, root_path),
      title: Path.basename(playlist_path, Path.extname(playlist_path))
    })


    tracks = File.read!(playlist_path)
    |> String.split(<< "\n" >>)
    |> Enum.reject(&(String.at(&1, 0) == "#" || String.length(&1) == 0))
    |> Enum.map(&( Path.absname(&1, root_path) ))
    |> Enum.each(fn track_path ->
      track = Repo.get_by(Track, filename: track_path)

      if !is_nil(track) do
        Ecto.build_assoc(playlist, :playlist_items, track_id: track.id)
        |> Repo.insert!
      end
    end)

    playlist
  end
end
