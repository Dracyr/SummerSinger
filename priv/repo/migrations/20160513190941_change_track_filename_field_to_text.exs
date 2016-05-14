defmodule SummerSinger.Repo.Migrations.ChangeTrackFilenameFieldToText do
  use Ecto.Migration

  def change do
    alter table(:tracks) do
      modify :filename, :text
    end

    alter table(:playlists) do
      modify :path, :text, null: true
    end
  end
end
