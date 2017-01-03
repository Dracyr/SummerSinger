defmodule SummerSinger.FsWatcher do
  use GenServer

  def start_link(default \\ %{}) do
    GenServer.start_link(__MODULE__, default)
  end

  def subscribe(pid, path, consumer_pid) do
    GenServer.call(pid, {:subscribe, path, consumer_pid})
  end

  def handle_call({:subscribe, path, pid}, from, state) do
    old_path = File.cwd!
    with :ok <- File.cd(path) do
      IO.inspect(:fs.path)
      IO.inspect(path)
      IO.inspect("fiule ok")
      :fs.subscribe
      File.cd(old_path)
      IO.inspect(File.cwd)
    end
    IO.inspect("tjosan")
    IO.inspect(path)
    {:reply, "hej", Map.put(state, path, pid)}
  end

  def handle_call(whatevs, from, state) do
    IO.inspect("whatevs")
    IO.inspect(whatevs)
    IO.inspect(state)
    {:reply, "hej", state}
  end

  def handle_info(msg, state) do
    IO.inspect(msg)
    {:noreply, state}
  end
end
