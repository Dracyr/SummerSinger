defmodule SummerSinger.Repo.Migrations.CreateLibrary do
  use Ecto.Migration

  def change do
    create table(:libraries) do
      add :path, :string
      add :title, :string

      timestamps()
    end

    alter table(:folders) do
      add :library_id, references(:libraries)
    end
  end
end
