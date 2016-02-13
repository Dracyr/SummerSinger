defmodule Mix.Tasks.SummerSinger.CleanRepo do
  use Mix.Task
  alias SummerSinger.{Repo, Track, Artist, Album, Playlist, PlaylistItem}

  def run(_args) do
    Mix.Task.run "app.start", []
    Repo.delete_all(PlaylistItem)
    Repo.delete_all(Playlist)
    Repo.delete_all(Track)
    Repo.delete_all(Album)
    Repo.delete_all(Artist)
  end
end
