defmodule SummerSinger.Repo.Migrations.AddAlbumToTracks do
  use Ecto.Migration

  def change do
    alter table(:tracks) do
      add :album_id, references(:albums)
    end

    alter table(:albums) do
      add :artist_id, references(:artists)
    end
  end
end
