defmodule SummerSinger.Watcher do
  use GenServer
  import Supervisor.Spec

  def start_link do
    {:ok, supervisor_pid} = Supervisor.start_link([], strategy: :one_for_one)
    GenServer.start_link(__MODULE__, supervisor_pid)
  end

  def subscribe(pid, path) do
    GenServer.call(pid, {:subscribe, path})
  end

  def handle_call({:subscribe, path}, _from, supervisor_pid) do
    watcher_name = String.replace(path, "/", "_")
    |> String.trim("_")
    |> String.to_atom

    watcher = worker(Sentix, [ watcher_name, [ path ], [recursive: true, access: false] ])
    Supervisor.start_child(supervisor_pid, watcher)
    Sentix.subscribe(watcher_name)
    {:reply, :ok, supervisor_pid}
  end

  def handle_info({_pid, _, {path, events}}, supervisor_pid) do
    IO.inspect(path)
    IO.inspect(events)
    {:noreply, supervisor_pid}
  end
end
