defmodule SummerSinger.Repo.Migrations.ChangeTrackDurationToFloat do
  use Ecto.Migration

  def change do
    alter table(:tracks) do
      modify :duration, :float, null: false
    end
  end
end
