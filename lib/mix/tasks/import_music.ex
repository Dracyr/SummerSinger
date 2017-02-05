defmodule Mix.Tasks.SummerSinger.ImportMusic do
  use Mix.Task

  def run([path | _args]) do
    Mix.Task.run "app.start", []

    SummerSinger.Importer.import_path(path)
  end
end
