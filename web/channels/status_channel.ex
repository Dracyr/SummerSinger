defmodule GrooveLion.RoomChannel do
  use Phoenix.Channel
  alias GrooveLion.{Player, Queue}

  def join("status:broadcast", auth_msg, socket) do
    {:ok, %{
      statusUpdate: Player.status,
      queue: Queue.queue
      }, socket}
  end

  def join("status:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("playback", %{"playback" => playback}, socket) do
    Player.playback(playback)

    broadcast! socket, "statusUpdate", Player.status
    {:noreply, socket}
  end

  def handle_in("queue_track", %{"track_id" => track_id}, socket) do
    Queue.queue_track(track_id)

    broadcast! socket, "queueUpdate", Queue.queue
    {:noreply, socket}
  end

  def handle_in("play_queued_track", %{"queue_id" => queue_id}, socket) do
    Player.play_queued_track(queue_id)

    broadcast! socket, "statusUpdate", Player.status
    {:noreply, socket}
  end

  def handle_in("previous_track", %{}, socket) do
    case Player.previous_track() do
      :ok ->
        broadcast! socket, "statusUpdate", Player.status
       _ ->
        {:noreply, socket}
    end

    {:noreply, socket}
  end

  def handle_in("next_track", %{}, socket) do
    case Player.next_track() do
      :ok ->
        broadcast! socket, "statusUpdate", Player.status
       _ ->
        {:noreply, socket}
    end

    {:noreply, socket}
  end

  def handle_in("seek", %{"percent" => percent}, socket) do
    Player.seek(percent)

    broadcast! socket, "statusUpdate", Player.status
    {:noreply, socket}
  end
end
