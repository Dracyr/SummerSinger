defmodule SummerSinger.Mixfile do
  use Mix.Project

  def project do
    [app: :summer_singer,
     version: "0.0.1",
     elixir: "~> 1.0",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     aliases: aliases(),
     deps: deps()]
  end

  # Configuration for the OTP application
  #
  # Type `mix help compile.app` for more information
  def application do
    # [extra_applications: [
    #   :logger
    # ]]
    [mod: {SummerSinger, []},
      applications: [
        :phoenix,
        :phoenix_pubsub,
        :phoenix_html,
        :cowboy,
        :logger,
        :gettext,
        :phoenix_ecto,
        :postgrex,
        :poolboy,
        :codepagex,
        :connection,
        :runtime_tools,
        :fs,
        :sentix,
        :poison,
        :porcelain,
        :arc_ecto
      ]
    ]
  end

  # Specifies which paths to compile per environment
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [{:phoenix, "~> 1.2"},
     {:phoenix_pubsub, "~> 1.0"},
     {:phoenix_ecto, "~> 3.0"},
     {:postgrex, ">= 0.0.0"},
     {:phoenix_html, "~> 2.5"},
     {:phoenix_live_reload, "~> 1.0", only: :dev},
     {:gettext, "~> 0.9"},
     {:cowboy, "~> 1.0"},
     {:codepagex, "~> 0.1.2"},
     {:poolboy, "~> 1.5"},
     {:distillery, "~> 0.9", runtime: false},
     #{:credo, "~> 0.5", only: [:dev, :test]},
     {:sentix, "~> 1.0.0"},
     {:poison, "~> 2.0"},
     {:filterable, "~> 0.0.1"},
     {:gen_stage, "~> 0.11"},
     {:porcelain, "~> 2.0"},
     {:flow, "~> 0.11"},
     {:arc_ecto, "0.5.0-rc1"} # To enable storing binary files
     # {:fs, "~> 0.9.1"}
     # {:fs, github: "synrc/fs"}
   ]
  end

  # Aliases are shortcut or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    ["ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
     "ecto.reset": ["ecto.drop", "ecto.setup"],
     "test": ["ecto.create --quiet", "ecto.migrate", "test"],
     "phoenix.digest": "summer_singer.digest",
     "summer_singer.release": ["compile", "summer_singer.digest", "release"]
    ]
  end
end
