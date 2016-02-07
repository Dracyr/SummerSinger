defmodule SummerSinger.Repo.Migrations.AddMetadataToTracks do
  use Ecto.Migration

  def change do
    alter table(:tracks) do
      add :metadata, :map
    end
  end
end
