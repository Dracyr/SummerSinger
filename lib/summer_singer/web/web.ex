defmodule SummerSinger.Web do
  @moduledoc """
  A module that keeps using definitions for controllers,
  views and so on.

  This can be used in your application as:

      use SummerSinger.Web, :controller
      use SummerSinger.Web, :view

  The definitions below will be executed for every view,
  controller, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below.
  """

  defmacro aliases do
    quote do
      alias SummerSinger.{Repo, Track, Album, Artist, Folder, Image, Playlist, PlaylistItem, Library}
    end
  end

  def model do
    quote do
      SummerSinger.Web.aliases()
      use Ecto.Schema
      import Ecto.Changeset
      import Ecto.Query, only: [from: 2]
    end
  end

  def controller do
    quote do
      use Phoenix.Controller, namespace: SummerSinger.Web
      SummerSinger.Web.aliases()

      import Ecto.Query, only: [from: 2]

      import SummerSinger.Web.Router.Helpers
    end
  end

  def view do
    quote do
      use Phoenix.View, root: "lib/summer_singer/web/templates",
                        namespace: MyApp.Web
      SummerSinger.Web.aliases()

      # Import convenience functions from controllers
      import Phoenix.Controller, only: [get_csrf_token: 0, get_flash: 2, view_module: 1]

      # Use all HTML functionality (forms, tags, etc)
      use Phoenix.HTML

      import SummerSinger.Web.Router.Helpers
    end
  end

  def router do
    quote do
      use Phoenix.Router
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
      SummerSinger.Web.aliases()

      import Ecto.Query, only: [from: 2]
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
