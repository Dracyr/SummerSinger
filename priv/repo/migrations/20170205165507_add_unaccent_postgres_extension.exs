defmodule SummerSinger.Repo.Migrations.AddUnaccentPostgresExtension do
  use Ecto.Migration

  def up do
    execute "CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;"
  end

  def down do
    execute "DROP EXTENSION IF EXISTS unaccent WITH SCHEMA public;"
  end
end
