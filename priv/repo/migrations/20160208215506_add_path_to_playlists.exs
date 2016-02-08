defmodule SummerSinger.Repo.Migrations.AddPathToPlaylists do
  use Ecto.Migration

  def change do
    alter table(:playlists) do
      add :path, :string
    end
  end
end
