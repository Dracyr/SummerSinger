defmodule Mix.Tasks.SummerSinger.Digest do
  use Mix.Task

  def run(args) do
    Mix.Shell.IO.cmd "MIX_ENV=prod npm run compile"
    :ok = Mix.Tasks.Phoenix.Digest.run(args)
  end
end
