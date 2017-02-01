defmodule SummerSinger.Repo.Migrations.ChangeImagesToCoverArt do
  use Ecto.Migration

  def change do
    rename table(:images), to: table(:cover_art)

    alter table(:cover_art) do
      remove :track_id
      remove :file
      modify :picture_type, :string
      modify :mime_type, :string

      add :cover_art, :string
    end

    alter table(:tracks) do
      add :cover_art_id, references(:cover_art)
    end

    alter table(:albums) do
      add :cover_art_id, references(:cover_art)
    end
  end
end
