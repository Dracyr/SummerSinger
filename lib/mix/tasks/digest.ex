defmodule Mix.Tasks.SummerSinger.Digest do
  use Mix.Task

  def run(args) do
    Mix.Shell.IO.cmd "NODE_ENV=prod ./node_modules/webpack/bin/webpack.js -p"
    :ok = Mix.Tasks.Phoenix.Digest.run(args)
  end
end
