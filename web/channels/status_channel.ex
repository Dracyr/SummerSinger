defmodule GrooveLion.RoomChannel do
  use Phoenix.Channel
  alias GrooveLion.Player
  alias GrooveLion.CurrentStatus

  def join("status:broadcast", auth_msg, socket) do
    {:ok, %{
      statusUpdate: CurrentStatus.get_status,
      queue: Player.get_queue
      }, socket}
  end

  def join("status:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("playback", %{"playback" => playback}, socket) do
    Player.playback(playback)

    broadcast! socket, "statusUpdate", CurrentStatus.get_status
    {:noreply, socket}
  end

  def handle_in("queue_track", %{"track_id" => track_id}, socket) do
    Player.queue_track(track_id)

    broadcast! socket, "queueUpdate", Player.get_queue
    {:noreply, socket}
  end

  def handle_in("play_track", %{"queue_id" => queue_id}, socket) do
    Player.play_track(queue_id)

    broadcast! socket, "statusUpdate", CurrentStatus.get_status
    {:noreply, socket}
  end
end
