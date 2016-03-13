defmodule SummerSinger.Repo.Migrations.AddRootToFolders do
  use Ecto.Migration

  def change do
    alter table(:folders) do
      add :root, :boolean, null: false, default: false
    end
  end
end
