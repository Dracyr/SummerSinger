defmodule SummerSinger.BackendPlayer do
  use GenServer
  require Logger

  def start_link do
    GenServer.start_link(__MODULE__, %{current_status: "stopped", port: nil}, name: __MODULE__)
  end

  def init(state) do
    port = Port.open(
      {:spawn, Application.get_env(:summer_singer, :mpg123_command)},
      [:use_stdio, :exit_status])

    {:ok, %{state | port: port}}
  end

  def status do
    GenServer.call(__MODULE__, {:status})
  end

  def playback(playback) do
    GenServer.cast(__MODULE__, {:playback, playback})
  end

  def load(path) do
    GenServer.cast(__MODULE__, {:load, path})
  end

  def volume(percent) do
    GenServer.cast(__MODULE__, {:volume, percent})
  end

  def seek(percent) do
    GenServer.cast(__MODULE__, {:seek, percent})
  end
  def quit() do
    GenServer.cast(__MODULE__, {:quit})
  end

  def handle_call({:status}, state) do
    {:reply, {:status, state}}
  end

  def handle_cast({:playback, playback}, state) do
    Logger.debug "Backend playback: #{playback}"
    {:noreply, playback(state, state[:port], playback)}
  end

  def handle_cast({:load, path}, state) do
    Logger.debug "Backend load: #{path}"
    Port.command(state[:port], "LOAD #{path}\n")
    {:noreply, state}
  end

  def handle_cast({:volume, percent}, state) do
    Logger.debug "Backend volume: #{percent}"
    Port.command(state[:port], "VOLUME #{percent}\n")
    {:noreply, state}
  end

  def handle_cast({:seek, percent}, state) do
    Logger.debug "Backend seek: #{percent}"
    Port.command(state[:port], "SEEK %#{percent * 100}\n") # what
    {:noreply, state}
  end

  def handle_cast({:quit}, state) do
    Port.command(state[:port], "QUIT\n")
    {:noreply, state}
  end

  def handle_info({_port_pid, {:data, messages}}, state) do
    Logger.debug "Backend message: #{messages}"
    messages = to_string(messages)
    state = String.split(messages, "\n")
    |> Enum.filter(fn(m) -> String.length(m) > 0 end)
    |> Enum.reduce(state, fn(message, state) -> handle_message(message, state) end)

    {:noreply, state}
  end

  def handle_info({_port, {:exit_status, _status}}, state) do
    Logger.error "Backend crashed, restarting backend port"

    port = Port.open(
      {:spawn, Application.get_env(:summer_singer, :mpg123_command)},
      [:use_stdio, :exit_status])

    SummerSinger.Player.next_track(true)

    {:noreply, %{state | port: port}}
  end

  defp playback(state, port, playback) do
    cond do
      playback == true && state[:current_status] == "paused" ->
        Port.command(port, "PAUSE\n")
        state
      playback == false && state[:current_status] == "playing" ->
        Port.command(port, "PAUSE\n")
        state
      true ->
        state
    end
  end

  defp handle_message(message, state) do
    case message do
      "INFO PLAYBACK stopped" ->
        SummerSinger.Player.next_track(true)
        %{state | current_status: "stopped"}
      "INFO PLAYBACK " <> status ->
        %{state | current_status: status}
      "ERROR " <> error ->
        Logger.error(error)
        state
      _ ->
        state
    end
  end
end
