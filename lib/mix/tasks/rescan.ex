defmodule Mix.Tasks.SummerSinger.Rescan do
  use Mix.Task

  def run(_args) do
    Mix.Task.run "app.start", []
    SummerSinger.Library
    |> SummerSinger.Repo.all
    |> Enum.each(&(SummerSinger.IndexMusic.run(&1.path)))
  end
end
