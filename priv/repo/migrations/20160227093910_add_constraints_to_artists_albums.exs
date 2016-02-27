defmodule SummerSinger.Repo.Migrations.AddConstraintsToArtistsAlbums do
  use Ecto.Migration

  def up do
    alter table(:artists) do
      modify :name, :string, null: false
    end
    create unique_index(:artists, [:name])

    alter table(:albums) do
      modify :title, :string, null: false
    end
  end

  def down do
  end
end
