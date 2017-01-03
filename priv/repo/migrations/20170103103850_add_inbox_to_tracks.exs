defmodule SummerSinger.Repo.Migrations.AddInboxToTracks do
  use Ecto.Migration

  def change do
    alter table(:tracks) do
      add :inbox, :boolean, null: false, default: true
    end
  end
end
