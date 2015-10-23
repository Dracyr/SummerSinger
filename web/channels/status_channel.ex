defmodule GrooveLion.RoomChannel do
  use Phoenix.Channel
  alias GrooveLion.Queue
  alias GrooveLion.CurrentStatus
  alias GrooveLion.Repo
  alias GrooveLion.Track

  def join("status:broadcast", auth_msg, socket) do
    {:ok, socket}
  end

  def join("status:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("playback", %{"playback" => playback}, socket) do
    current_status = CurrentStatus.get_status()
    CurrentStatus.set_playback(!current_status[:playback])

    broadcast! socket, "statusUpdate", CurrentStatus.get_status()
    {:noreply, socket}
  end

  def handle_in("queue_track", %{"track_id" => track_id}, socket) do
    Queue.add_track(track_id)
    broadcast! socket, "queueUpdate", %{queue: Queue.get_tracks()}
    {:noreply, socket}
  end
end
