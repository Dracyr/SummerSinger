defmodule SummerSinger.Repo.Migrations.CreatePlaylistItems do
  use Ecto.Migration

  def change do
    create table(:playlist_items) do
      add :playlist_id, references(:playlists)
      add :track_id, references(:tracks)
      add :item_order, :integer

      timestamps
    end
  end
end
