defmodule SummerSinger.Web.LibraryView do
  use SummerSinger.Web, :view

  def render("index.json", %{libraries: libraries}) do
    %{data: render_many(libraries, SummerSinger.Web.LibraryView, "library.json")}
  end

  def render("show.json", %{library: library}) do
    %{data: render_one(library, SummerSinger.Web.LibraryView, "library.json")}
  end

  def render("library.json", %{library: library}) do
    %{id: library.id,
      path: library.path,
      title: library.title}
  end
end
