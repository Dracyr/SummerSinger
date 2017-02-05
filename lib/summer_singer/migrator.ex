defmodule SummerSinger.Migrator do
  def migrate do
    {:ok, _} = Application.ensure_all_started(:summer_singer)

    path = Application.app_dir(:summer_singer, "priv/repo/migrations")

    Ecto.Migrator.run(SummerSinger.Repo, path, :up, all: true)

    # Restart so postgres extensions get re-enabled
    Application.stop(:postgrex)
    Application.ensure_all_started(:postgrex)

    :ok
  end
end
