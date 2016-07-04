defmodule SummerSinger.Router do
  use SummerSinger.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", SummerSinger do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", SummerSinger do
    pipe_through :api

    get "/status", StatusController, :show
    get "/queue", QueueController, :show
    resources "/tracks", TrackController, except: [:new, :edit]
    resources "/albums", AlbumController, except: [:new, :edit]
    resources "/artists", ArtistController, except: [:new, :edit]
    resources "/playlists", PlaylistController
    resources "/libraries", LibraryController
    resources "/folders", FolderController
  end
end
