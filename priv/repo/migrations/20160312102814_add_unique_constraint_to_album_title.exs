defmodule SummerSinger.Repo.Migrations.AddUniqueConstraintToAlbumTitle do
  use Ecto.Migration

  def change do
    create unique_index(:albums, [:title, :artist_id], name: :albums_title_artist_id_index)
  end
end
