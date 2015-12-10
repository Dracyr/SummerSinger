defmodule GrooveLion.Repo.Migrations.AddRatingAndArtistToTracks do
  use Ecto.Migration

  def change do
    alter table(:tracks) do
      add :rating, :integer

      remove :artist
      add :artist_id, references(:artists)
    end
  end
end
