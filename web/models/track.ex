defmodule GrooveLion.Track do
  use GrooveLion.Web, :model

  schema "tracks" do
    field :title,    :string
    field :filename, :string
    field :metadata, :map
    field :duration, :integer
    field :rating,   :integer

    belongs_to :artist, GrooveLion.Artist
    belongs_to :album,  GrooveLion.Album
    has_many   :images, GrooveLion.Image

    timestamps
  end

  @required_fields ~w(title filename duration)
  @optional_fields ~w(rating metadata)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def to_map(track, index) do
    to_map(track) |> Map.merge(%{index: index})
  end

  def to_map(track) do
     %{
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      duration: track.duration
    }
  end

  def filename_exists?(filename) do
    case GrooveLion.Repo.get_by(__MODULE__, filename: filename) do
      nil -> false
      _   -> true
    end
  end
end
