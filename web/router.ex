defmodule GrooveLion.Router do
  use GrooveLion.Web, :router

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

  scope "/", GrooveLion do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", GrooveLion do
    pipe_through :api

    resources "/tracks", TrackController, except: [:new, :edit]
    resources "/albums", AlbumController, except: [:new, :edit]
    resources "/artists", ArtistController, except: [:new, :edit]
    resources "/playlists", PlaylistController
  end
end
