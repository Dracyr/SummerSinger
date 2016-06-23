defmodule SummerSinger.Playlist do
  use SummerSinger.Web, :model

  schema "playlists" do
    field :title, :string
    field :path, :string

    has_many :playlist_items, SummerSinger.PlaylistItem, on_delete: :delete_all
    has_many :tracks, through: [:playlist_items, :track]

    timestamps
  end

  @doc """
  Creates a changeset based on the `playlist` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(playlist, params \\ %{}) do
    playlist
    |> cast(params, [:title, :path])
    |> validate_required(:title)
    |> unique_constraint(:path)
  end

  def create(playlist_path, root_path \\ "/") do
    playlist = Playlist.changeset(%Playlist{}, %{
      path: Path.absname(playlist_path, root_path),
      title: Path.basename(playlist_path, Path.extname(playlist_path))
    }) |> Repo.insert!

    read_playlist(playlist_path)
    |> Enum.each(&add_track(&1, playlist))

    playlist
  end

  def add_track_to_playlist(track_id, playlist_id) do
    playlist = Repo.get(Playlist, playlist_id)
    Ecto.build_assoc(playlist, :playlist_items, track_id: track_id)
    |> Repo.insert!
  end

  def collect_tracks(playlist_id) do
    query = from p in SummerSinger.Playlist,
      where: p.id == ^playlist_id,
      preload: [:tracks]

    Repo.all(query)
    |> List.first
    |> Map.fetch!(:tracks)
    |> Enum.map(&Map.fetch!(&1, :id))
  end

  defp to_utf8(file) do
    :unicode.characters_to_binary(file, elem(:unicode.bom_to_encoding(file), 0))
  end

  defp read_playlist(playlist_path) do
    File.read!(playlist_path)
    |> to_utf8
    |> String.split(<< "\n" >>)
    |> Enum.reject(&(String.at(&1, 0) == "#" || String.length(&1) == 0))
    |> Enum.filter(&(String.contains?(&1, ".mp3")))
    |> Enum.map(&String.strip/1)
  end

  defp add_track(track_path, playlist) do
    abs_path = Path.expand track_path, Path.dirname(playlist.path) # This line is magic, don't touch it

    track = Repo.get_by(Track, filename: abs_path)
    if !is_nil(track) do
      Ecto.build_assoc(playlist, :playlist_items, track_id: track.id)
      |> Repo.insert!
    end
  end
end
