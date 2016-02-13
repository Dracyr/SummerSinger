defmodule SummerSinger.Repo.Migrations.AddPathToPlaylists do
  use Ecto.Migration

  def change do
    alter table(:playlists) do
      add :path, :string, null: false
    end
    create unique_index(:playlists, [:path])
  end
end
