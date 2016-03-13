defmodule SummerSinger.Repo.Migrations.CreateFolder do
  use Ecto.Migration

  def change do
    create table(:folders) do
      add :path, :string, null: false
      add :title, :string, null: false

      add :parent_id, references(:folders)
      timestamps
    end
    create unique_index(:folders, [:path])

    alter table(:tracks) do
      add :folder_id, references(:folders)
    end
  end
end
