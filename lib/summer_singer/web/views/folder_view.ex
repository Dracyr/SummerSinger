defmodule SummerSinger.Web.FolderView do
  use SummerSinger.Web, :view

  def render("index.json", %{folders: folders}) do
    %{data: render_many(folders, SummerSinger.Web.FolderView, "folder.json")}
  end

  def render("show.json", %{folder: folder}) do
    %{data: render_one(folder, SummerSinger.Web.FolderView, "folder.json")}
  end

  def render("folder.json", %{folder: folder}) do
    %{id: folder.id,
      title: folder.title,
      children: render_many(folder.children, SummerSinger.Web.FolderView, "folder_lite.json"),
      #tracks: render_many(folder.tracks, SummerSinger.Web.TrackView, "track.json")
    }
  end

  def render("folder_lite.json", %{folder: folder}) do
    %{
      id: folder.id,
      title: folder.title
    }
  end
end
