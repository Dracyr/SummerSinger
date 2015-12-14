defmodule GrooveLion.Repo.Migrations.CreatePlaylist do
  use Ecto.Migration

  def change do
    create table(:playlists) do
      add :title, :string

      timestamps
    end

  end
end
