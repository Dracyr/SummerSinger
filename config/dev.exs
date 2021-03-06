use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
config :summer_singer, SummerSinger.Web.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  cache_static_lookup: false,
  check_origin: false,
  watchers: [
    node: ["webpack-dev-server.js", cd: Path.expand("../assets", __DIR__)],
    npm: ["run", "watch:css", cd: Path.expand("../assets", __DIR__)],
  ]

# Watch static and templates for browser reloading.
config :summer_singer, SummerSinger.Web.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(css)$},
      ~r{lib/summer_singer/web/views/.*(ex)$},
      ~r{lib/summer_singer/web/templates/.*(eex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development.
# Do not configure such in production as keeping
# and calculating stacktraces is usually expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :summer_singer, SummerSinger.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "summer_singer_dev",
  hostname: "localhost",
  pool_size: 10
