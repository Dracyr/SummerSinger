defmodule Mix.Tasks.SummerSinger.IndexMusic do
  use Mix.Task

  def run([path | _args]) do
    Mix.Task.run "app.start", []
    SummerSinger.IndexMusic.run(path)
  end
end
