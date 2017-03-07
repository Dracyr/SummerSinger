defmodule SummerSinger do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      # Start the endpoint when the application starts
      supervisor(SummerSinger.Web.Endpoint, []),
      # Start the Ecto repository
      worker(SummerSinger.Repo, []),
      # Here you could define other workers and supervisors as children
      worker(SummerSinger.PlayerSupervisor, []),
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: SummerSinger.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
