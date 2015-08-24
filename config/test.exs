use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :groove_lion, GrooveLion.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :groove_lion, GrooveLion.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "groove_lion_test",
  pool: Ecto.Adapters.SQL.Sandbox
