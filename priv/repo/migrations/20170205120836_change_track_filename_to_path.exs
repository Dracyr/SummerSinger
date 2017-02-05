defmodule SummerSinger.Repo.Migrations.ChangeTrackFilenameToPath do
  use Ecto.Migration

  def change do
    rename table(:tracks), :filename, to: :path

    alter table(:tracks) do
      modify :path, :text, null: false
    end

    create unique_index(:tracks, [:path])
  end
end
