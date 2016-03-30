defmodule SummerSinger.Playlist do
  use SummerSinger.Web, :model
  require IEx
  alias SummerSinger.{Playlist, PlaylistItem, Repo, Track}

  schema "playlists" do
    field :title, :string
    field :path, :string

    has_many :playlist_items, SummerSinger.PlaylistItem
    has_many :tracks, through: [:playlist_items, :track]

    timestamps
  end

  @required_fields ~w(title)
  @optional_fields ~w(path)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:path)
  end

  def create(playlist_path, root_path \\ "/") do
    IO.inspect("Adding" <> playlist_path)
    changeset = Playlist.changeset(%Playlist{}, %{
      path: Path.absname(playlist_path, root_path),
      title: Path.basename(playlist_path, Path.extname(playlist_path))
    })
    playlist = Repo.insert!(changeset, log: false)
    tracks = File.read!(playlist_path)
    |> to_utf8
    |> String.split(<< "\n" >>)
    |> Enum.reject(&(String.at(&1, 0) == "#" || String.length(&1) == 0))
    |> Enum.filter(&(String.contains?(&1, ".mp3")))
    |> Enum.map(&String.strip/1)
    |> Enum.each(fn track_path ->
      abs_path = Path.expand track_path, Path.dirname(playlist_path) # This line is magic, don't touch it

      track = Repo.get_by(Track, filename: abs_path)
      if !is_nil(track) do
        Ecto.build_assoc(playlist, :playlist_items, track_id: track.id)
        |> Repo.insert!(log: false)
      end
    end)

    playlist
  end

  defp to_utf8(file) do
    :unicode.characters_to_binary(file, elem(:unicode.bom_to_encoding(file), 0))
  end
end
