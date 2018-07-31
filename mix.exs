defmodule SummerSinger.Mixfile do
  use Mix.Project

  def project do
    [
      app: :summer_singer,
      version: "1.0.0",
      elixir: "~> 1.0",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix] ++ Mix.compilers(),
      build_embedded: Mix.env() == :prod,
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application
  #
  # Type `mix help compile.app` for more information
  def application do
    [
      mod: {SummerSinger, []},
      applications: [
        :phoenix,
        :phoenix_pubsub,
        :phoenix_html,
        :cowboy,
        :logger,
        :gettext,
        :phoenix_ecto,
        :postgrex,
        :poison,
        :porcelain,
        :arc_ecto,
        :arc,
        :filterable,
        :progress_bar,
        :mix,
        :mime
      ]
    ]
  end

  # Specifies which paths to compile per environment
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.3.0-rc"},
      {:phoenix_pubsub, "~> 1.0"},
      {:phoenix_ecto, "~> 3.0"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 2.5"},
      {:phoenix_live_reload, "~> 1.0", only: :dev},
      {:gettext, "~> 0.9"},
      {:cowboy, "~> 1.0"},
      {:distillery, "~> 1.0", runtime: false},
      {:filterable, "~> 0.1.3"},
      {:poison, "~> 2.0"},
      {:porcelain, "~> 2.0"},
      # Old version to enable storing binary files
      {:arc_ecto, "0.5.0-rc1"},
      {:progress_bar, "> 0.0.0"},
      {:credo, "~> 0.5", only: [:dev, :test]},
      {:mime, "~> 1.1"}
    ]
  end

  # Aliases are shortcut or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate", "test"],
      "phoenix.digest": "summer_singer.digest",
      "summer_singer.release": ["compile", "summer_singer.digest", "release"]
    ]
  end
end
