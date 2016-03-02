defmodule SummerSinger.Repo.Migrations.CreateTrackTrigramIndexes do
  use Ecto.Migration

  def up do
    execute "CREATE extension if not exists pg_trgm;"
    execute "CREATE INDEX tracks_title_trgm_index ON tracks USING gin (title gin_trgm_ops);"
    execute "CREATE INDEX artists_name_trgm_index ON artists USING gin (name gin_trgm_ops);"
    execute "CREATE INDEX albums_title_trgm_index ON albums USING gin (title gin_trgm_ops);"
  end

  def down do
    execute "DROP INDEX tracks_title_trgm_index;"
    execute "DROP INDEX artists_name_trgm_index;"
    execute "DROP INDEX albums_title_trgm_index;"
  end
end
