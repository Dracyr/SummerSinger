defmodule GrooveLion.Repo.Migrations.CreateImages do
  use Ecto.Migration

  def change do
    create table(:images) do
      add :track_id , references(:tracks)
      add :picture_type , :integer
      add :mime_type , :integer
      add :description , :string
      add :file , :binary

      timestamps
    end
  end
end
