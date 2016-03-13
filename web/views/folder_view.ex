defmodule SummerSinger.FolderView do
  use SummerSinger.Web, :view

  def render("index.json", %{folders: folders}) do
    %{data: render_many(folders, SummerSinger.FolderView, "folder.json")}
  end

  def render("show.json", %{folder: folder}) do
    %{data: render_one(folder, SummerSinger.FolderView, "folder.json")}
  end

  def render("folder.json", %{folder: folder}) do
    %{id: folder.id,
      title: folder.title,
      children: render_many(folder.children, SummerSinger.FolderView, "folder_lite.json"),
      tracks: render_many(folder.tracks, SummerSinger.TrackView, "track.json")
    }
  end

  def render("folder_lite.json", %{folder: folder}) do
    %{
      id: folder.id,
      title: folder.title
    }
  end
end
