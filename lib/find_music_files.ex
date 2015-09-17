defmodule GrooveLion.FindMusicFiles do

  def find_files do
    find_files("/home/dracyr/Music")
  end

  def find_files(path) do
    path |> Path.join("**/*.{mp3,m4a}") |> Path.wildcard()
  end
end
