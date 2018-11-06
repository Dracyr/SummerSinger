defmodule SummerSinger.Web.RoomChannel do
  require Logger
  use Phoenix.Channel
  alias SummerSinger.{Repo, Player, Queue, Playlist, Folder}
  alias SummerSinger.Web.{LibraryView, TrackView, PlaylistView, Endpoint}

  def join("status:broadcast", _auth_msg, socket) do
    {:ok,
     %{
       statusUpdate: current_status(),
       queue: Queue.queue()
     }, socket}
  end

  def join("status:" <> _private_room_id, _auth_msg, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("playback", %{"playback" => playback}, socket) do
    Player.playback(playback)

    broadcast!(socket, "statusUpdate", current_status())
    {:noreply, socket}
  end

  def handle_in("queue_track", %{"track_id" => track_id, "play" => true}, socket) do
    Queue.queue_track(track_id) |> Player.play_queued_track()
    broadcast!(socket, "statusUpdate", current_status())

    broadcast!(socket, "queueUpdate", Queue.queue())
    {:noreply, socket}
  end

  def handle_in("queue_track", %{"track_id" => track_id, "play" => false}, socket) do
    Queue.queue_track(track_id)

    broadcast!(socket, "queueUpdate", Queue.queue())
    {:noreply, socket}
  end

  def handle_in("play_track", %{"queue_id" => queue_id}, socket) do
    Player.play_queued_track(queue_id)

    broadcast!(socket, "statusUpdate", current_status())
    {:noreply, socket}
  end

  def handle_in("previous_track", %{}, socket) do
    if Player.previous_track() == :ok do
      broadcast!(socket, "statusUpdate", current_status())
    end

    {:noreply, socket}
  end

  def handle_in("next_track", %{}, socket) do
    if Player.next_track() == :ok do
      broadcast!(socket, "statusUpdate", current_status())
    end

    {:noreply, socket}
  end

  def handle_in("seek", %{"percent" => percent}, socket) do
    Player.seek(percent)

    broadcast!(socket, "statusUpdate", current_status())
    {:noreply, socket}
  end

  def handle_in("volume", %{"percent" => percent}, socket) do
    Player.volume(percent)

    broadcast!(socket, "statusUpdate", current_status())
    {:noreply, socket}
  end

  def handle_in("remove_queue_track", %{"track_index" => track_index}, socket) do
    Queue.remove_track(track_index)

    broadcast!(socket, "queueUpdate", Queue.queue())
    broadcast!(socket, "statusUpdate", current_status())
    {:noreply, socket}
  end

  def handle_in(
        "add_track_to_playlist",
        %{"track_id" => track_id, "playlist_id" => playlist_id},
        socket
      ) do
    Playlist.add_track_to_playlist(track_id, playlist_id)

    # TODO: Only delta updates
    playlists_update()
    {:noreply, socket}
  end

  def handle_in("queue_playlist", %{"playlist_id" => playlist_id, "play" => play}, socket) do
    Playlist.collect_tracks(playlist_id)
    |> Queue.queue_tracks()
    |> (&(play && Player.play_queued_track(&1))).()

    broadcast!(socket, "queueUpdate", Queue.queue())
    broadcast!(socket, "statusUpdate", current_status())
    {:noreply, socket}
  end

  def handle_in("queue_folder", %{"folder_id" => folder_id, "play" => play}, socket) do
    Folder.collect_tracks(folder_id)
    |> Queue.queue_tracks()
    |> (&(play && Player.play_queued_track(&1))).()

    broadcast!(socket, "queueUpdate", Queue.queue())
    broadcast!(socket, "statusUpdate", current_status())
    {:noreply, socket}
  end

  def handle_in("clear_queue", %{}, socket) do
    Queue.clear_queue()

    broadcast!(socket, "queueUpdate", Queue.queue())
    {:noreply, socket}
  end

  def handle_in("clear_inbox", %{}, socket) do
    Repo.update_all(SummerSinger.Track, set: [inbox: false])

    Endpoint.broadcast!("status:broadcast", "clearInbox", %{success: true})
    {:noreply, socket}
  end

  def playlists_update do
    data = PlaylistView.render("index.json", playlists: Repo.all(Playlist))
    Endpoint.broadcast!("status:broadcast", "playlistsUpdate", data)
  end

  def track_update(track) do
    data = TrackView.render("show.json", %{track: track})

    Endpoint.broadcast!("status:broadcast", "trackUpdate", data)
  end

  def update(%{resource_type: :library, action: action, resource: resource}) do
    data = %{
      resource_type: :library,
      action: action,
      data: LibraryView.render("show.json", library: resource)
    }

    Endpoint.broadcast!("status:broadcast", "libraryUpdate", data)
  end

  defp current_status do
    Player.status() |> Map.merge(%{current_time: DateUtil.now()})
  end

  def handle_in("request_import", params, socket) do
    # {matching_data, _count} = Importer.Matcher.do_stuff()

    # data = Enum.map(matching_data, fn {i, t} -> %{score: i, track_info: t} end)

    track_data = %{
      data: [
        %{
          score: 0.15000000000000002,
          track_info: %{
            arranger: nil,
            artist: "Fleet Foxes",
            artist_credit: "Fleet Foxes",
            artist_id: "fa97dd36-1b82-43d7-a6e4-2adeafd59cef",
            artist_sort: "Fleet Foxes",
            composer: nil,
            composer_sort: nil,
            data_source: "MusicBrainz",
            data_url: "/recording/0b95a44f-328d-40f4-ad38-5568003bf930",
            disctitle: nil,
            id: "0b95a44f-328d-40f4-ad38-5568003bf930",
            index: nil,
            length: 212.0,
            lyricist: nil,
            media: nil,
            medium: nil,
            medium_index: nil,
            medium_total: nil,
            title: "Lorelai (radio edit)",
            track_alt: nil,
            track_id: "0b95a44f-328d-40f4-ad38-5568003bf930"
          }
        }
      ]
    }

    album_data = %{
      # Albums sorted by suitability
      # Maybe want a key or two for percentage and stuff?
      album: %{
        script: "Latn",
        releasegroup_id: "aa997ea0-2936-40bd-884d-3af8a0e064dc",
        original_year: "2013",
        original_month: "05",
        original_day: "17",
        month: "05",
        mediums: 1,
        media: "Digital Media",
        language: "eng",
        label: "Columbia",
        day: "17",
        year: "2016",
        data_url: "/release/36e2aede-346d-4931-8565-78d810d167c7",
        data_source: "MusicBrainz",
        country: nil,
        catalognum: nil,
        asin: nil,
        artist_sort: "Daft Punk",
        artist_id: "056e4f3e-d505-4dad-8ec1-d04f521cbb56",
        artist_credit: "Daft Punk",
        artist: "Daft Punk",
        albumtype: nil,
        albumstatus: "Official",
        albumdisambig: ", ",
        album_id: "36e2aede-346d-4931-8565-78d810d167c7",
        album: "Random Access Memories"
      }, # metadata stored in the files.
      matched_albums: [
        %{
          score: 0.94,
          album_info: %{
            album: "Random Access Memories",
            album_id: "2884cdca-ef0e-4573-acc5-777aa60aa12d",
            albumdisambig: ", YouTube playlist",
            albumstatus: "Official",
            albumtype: nil,
            artist: "Daft Punk",
            artist_credit: "Daft Punk",
            artist_id: "056e4f3e-d505-4dad-8ec1-d04f521cbb56",
            artist_sort: "Daft Punk",
            asin: nil,
            catalognum: nil,
            country: nil,
            data_source: "MusicBrainz",
            data_url: "/release/2884cdca-ef0e-4573-acc5-777aa60aa12d",
            day: "17",
            label: nil,
            language: "eng",
            media: "Digital Media",
            mediums: 1,
            month: "05",
            original_day: "17",
            original_month: "05",
            original_year: "2013",
            releasegroup_id: "aa997ea0-2936-40bd-884d-3af8a0e064dc",
            script: "Latn",
          },
          track_pairs: [
            %{
              index: 0, # Medium index, maybe add cd as well? Can be implicit.
              score: 0.92,
              stored_track: %{}, # Track data for the one we have
              matched_track: %{} # Track data for the matched one. If missing, no match? yeah
            }
          ],
          extra_tracks: [
            %{} # List of tracks in the matched data, that could not be mapped to a stored one
          ]
        }
      ]
    }

    data = album_data

    # {:reply, {:ok, %{matching: matching_data}}, socket}
    Endpoint.broadcast!("status:broadcast", "importerUpdate", data)

    {:noreply, socket}
  end

  def handle_in(event, _payload, socket) do
    Logger.warn("Unhandled event! #{event}")
    {:noreply, socket}
  end
end
