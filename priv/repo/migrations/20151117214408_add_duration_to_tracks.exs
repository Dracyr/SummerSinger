defmodule SummerSinger.Repo.Migrations.AddDurationToTracks do
  use Ecto.Migration

    def change do
    alter table(:tracks) do
      add :duration, :integer
    end
  end
end
