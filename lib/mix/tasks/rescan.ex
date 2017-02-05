defmodule Mix.Tasks.SummerSinger.Rescan do
  use Mix.Task

  def run(_args) do
    Mix.Task.run "app.start", []

    SummerSinger.Importer.rescan()
  end
end
