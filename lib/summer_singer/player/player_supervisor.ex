defmodule SummerSinger.PlayerSupervisor do
  use Supervisor

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: SummerSinger.PlayerSupervisor)
  end

  def init([]) do
    children = [
      worker(SummerSinger.BackendPlayer, []),
      worker(SummerSinger.Queue, []),
      worker(SummerSinger.Player, []),
    ]

    supervise(children, strategy: :one_for_all)
  end
end
