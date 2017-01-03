# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :summer_singer, SummerSinger.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "tqW9azCIn08D2k+S7Ml8VXuMYdft8o7+NUBeyzycZr1YikaKv2i4aRiAlXfeiBJB",
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: SummerSinger.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Configure phoenix generators
config :phoenix, :generators,
  migration: true,
  binary_id: false

config :summer_singer, ecto_repos: [SummerSinger.Repo]

config :codepagex, :encodings, [:iso_8859_1, :ascii]

config :summer_singer,
  env: Mix.env,
  mpg123_command: "remote-player"
  #mpg123_command: "mpg123 -R"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
