defmodule SummerSinger.PlaylistItem do
  use SummerSinger.Web, :model

  schema "playlist_items" do
    belongs_to :playlist, SummerSinger.Playlist
    belongs_to :track, SummerSinger.Track

    timestamps
  end

  @doc """
  Creates a changeset based on the `playlist_item` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(playlist_item, params \\ %{}) do
    playlist_item
    |> cast(params, [:playlist_id, :track_id])
    |> validate_required([:playlist_id, :track_id])
  end
end
