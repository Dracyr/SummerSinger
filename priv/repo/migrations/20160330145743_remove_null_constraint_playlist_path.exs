defmodule SummerSinger.Repo.Migrations.RemoveNullConstraintPlaylistPath do
  use Ecto.Migration

  def change do
    alter table(:playlists) do
      modify :path, :string, null: true
    end
  end
end
