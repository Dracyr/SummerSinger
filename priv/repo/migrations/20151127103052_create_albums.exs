defmodule SummerSinger.Repo.Migrations.CreateAlbums do
  use Ecto.Migration

  def change do
    create table(:albums) do
      add :title, :string
      add :year, :string

      timestamps
    end
  end
end
