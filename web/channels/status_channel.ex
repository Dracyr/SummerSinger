defmodule SummerSinger.RoomChannel do
  use Phoenix.Channel
  alias SummerSinger.{Player, Queue}

  def join("status:broadcast", _auth_msg, socket) do
    {:ok, %{
      statusUpdate: current_status,
      queue: Queue.queue
      }, socket}
  end

  def join("status:" <> _private_room_id, _auth_msg, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("playback", %{"playback" => playback}, socket) do
    Player.playback(playback)

    broadcast! socket, "statusUpdate", current_status
    {:noreply, socket}
  end

  def handle_in("queue_track", %{"track_id" => track_id}, socket) do
    Queue.queue_track(track_id)

    broadcast! socket, "queueUpdate", Queue.queue
    {:noreply, socket}
  end

  def handle_in("play_queued_track", %{"queue_id" => queue_id}, socket) do
    Player.play_queued_track(queue_id)

    broadcast! socket, "statusUpdate", current_status
    {:noreply, socket}
  end

  def handle_in("previous_track", %{}, socket) do
    case Player.previous_track() do
      :ok ->
        broadcast! socket, "statusUpdate", current_status
       _ ->
        {:noreply, socket}
    end

    {:noreply, socket}
  end

  def handle_in("next_track", %{}, socket) do
    case Player.next_track() do
      :ok ->
        broadcast! socket, "statusUpdate", current_status
       _ ->
        {:noreply, socket}
    end

    {:noreply, socket}
  end

  def handle_in("seek", %{"percent" => percent}, socket) do
    Player.seek(percent)

    broadcast! socket, "statusUpdate", current_status
    {:noreply, socket}
  end

  def playlists_update do
    data = SummerSinger.PlaylistView.render("index.json", playlists: SummerSinger.Repo.all(SummerSinger.Playlist))
    SummerSinger.Endpoint.broadcast! "status:broadcast", "playlistsUpdate", data
  end

  defp current_status do
    Player.status |> Map.merge(%{current_time: DateUtil.now})
  end
end
