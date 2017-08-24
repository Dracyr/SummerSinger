defmodule SummerSinger.Web.RoomChannel do
  use Phoenix.Channel
  alias SummerSinger.{Repo, Player, Queue, Playlist, Folder}
  alias SummerSinger.Web.{LibraryView, TrackView, PlaylistView, Endpoint}

  def join("status:broadcast", _auth_msg, socket) do
    {:ok, %{
      statusUpdate: current_status(),
      queue: Queue.queue
      }, socket}
  end

  def join("status:" <> _private_room_id, _auth_msg, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("playback", %{"playback" => playback}, socket) do
    Player.playback(playback)

    broadcast! socket, "statusUpdate", current_status()
    {:noreply, socket}
  end

  def handle_in("queue_track", %{"track_id" => track_id, "play" => true}, socket) do
    Queue.queue_track(track_id) |> Player.play_queued_track
    broadcast! socket, "statusUpdate", current_status()

    broadcast! socket, "queueUpdate", Queue.queue
    {:noreply, socket}
  end

  def handle_in("queue_track", %{"track_id" => track_id, "play" => false}, socket) do
    Queue.queue_track(track_id)

    broadcast! socket, "queueUpdate", Queue.queue
    {:noreply, socket}
  end

  def handle_in("play_track", %{"queue_id" => queue_id}, socket) do
    Player.play_queued_track(queue_id)

    broadcast! socket, "statusUpdate", current_status()
    {:noreply, socket}
  end

  def handle_in("previous_track", %{}, socket) do
    if Player.previous_track() == :ok do
      broadcast! socket, "statusUpdate", current_status()
    end
    {:noreply, socket}
  end

  def handle_in("next_track", %{}, socket) do
    if Player.next_track() == :ok do
      broadcast! socket, "statusUpdate", current_status()
    end
    {:noreply, socket}
  end

  def handle_in("seek", %{"percent" => percent}, socket) do
    Player.seek(percent)

    broadcast! socket, "statusUpdate", current_status()
    {:noreply, socket}
  end

  def handle_in("volume", %{"percent" => percent}, socket) do
    Player.volume(percent)

    broadcast! socket, "statusUpdate", current_status()
    {:noreply, socket}
  end

  def handle_in("remove_queue_track", %{"track_index" => track_index}, socket) do
    Queue.remove_track(track_index)

    broadcast! socket, "queueUpdate", Queue.queue
    broadcast! socket, "statusUpdate", current_status()
    {:noreply, socket}
  end

  def handle_in("add_track_to_playlist", %{"track_id" => track_id, "playlist_id" => playlist_id}, socket) do
    Playlist.add_track_to_playlist(track_id, playlist_id)

    playlists_update() # TODO: Only delta updates
    {:noreply, socket}
  end

  def handle_in("queue_playlist", %{"playlist_id" => playlist_id, "play" => play}, socket) do
    Playlist.collect_tracks(playlist_id)
    |> Queue.queue_tracks
    |> (&(play && Player.play_queued_track(&1))).()

    broadcast! socket, "queueUpdate", Queue.queue
    broadcast! socket, "statusUpdate", current_status()
    {:noreply, socket}
  end

  def handle_in("queue_folder", %{"folder_id" => folder_id, "play" => play}, socket) do
    Folder.collect_tracks(folder_id)
    |> Queue.queue_tracks
    |> (&(play && Player.play_queued_track(&1))).()

    broadcast! socket, "queueUpdate", Queue.queue
    broadcast! socket, "statusUpdate", current_status()
    {:noreply, socket}
  end

  def handle_in("clear_queue", %{}, socket) do
    Queue.clear_queue

    broadcast! socket, "queueUpdate", Queue.queue
    {:noreply, socket}
  end

  def handle_in("clear_inbox", %{}, socket) do
    Repo.update_all(SummerSinger.Track, set: [inbox: false])

    Endpoint.broadcast! "status:broadcast", "clearInbox", %{success: true}
    {:noreply, socket}
  end

  def playlists_update do
    data = PlaylistView.render("index.json", playlists: Repo.all(Playlist))
    Endpoint.broadcast! "status:broadcast", "playlistsUpdate", data
  end

  def track_update(track) do
    data = TrackView.render("show.json", %{track: track})

    Endpoint.broadcast! "status:broadcast", "trackUpdate", data
  end

  def update(%{resource_type: :library, action: action, resource: resource}) do
    data = %{
      resource_type: :library,
      action: action,
      data: LibraryView.render("show.json", library: resource)
    }
    Endpoint.broadcast! "status:broadcast", "libraryUpdate", data
  end


  defp current_status do
    Player.status |> Map.merge(%{current_time: DateUtil.now})
  end
end
