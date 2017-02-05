defmodule SummerSinger.Repo.Migrations.AddImportedToTracks do
  use Ecto.Migration

  def change do
    alter table(:tracks) do
      add :imported, :boolean, null: false, default: false
    end
  end
end
