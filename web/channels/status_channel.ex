defmodule GrooveLion.RoomChannel do
  use Phoenix.Channel

  def join("status:broadcast", auth_msg, socket) do
    {:ok, socket}
  end

  def join("status:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("playback", %{"playback" => playback}, socket) do
    current_status = GrooveLion.CurrentStatus.get_status()
    GrooveLion.CurrentStatus.set_playback(!current_status[:playback])

    broadcast! socket, "statusUpdate", GrooveLion.CurrentStatus.get_status()
    {:noreply, socket}
  end
end
