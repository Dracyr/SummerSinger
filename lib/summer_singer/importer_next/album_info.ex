defmodule AutoTagger.AlbumInfo do
  alias AutoTagger.AlbumInfo

  defstruct [
    # ``album``: the release title
    :album,
    # ``album_id``: MusicBrainz ID; UUID fragment only
    :album_id,
    # ``artist``: name of the release's primary artist
    :artist,
    # ``artist_id``
    :artist_id,
    # ``tracks``: list of TrackInfo objects making up the release
    tracks: [],
    # ``asin``: Amazon ASIN
    asin: nil,
    # ``albumtype``: string describing the kind of release
    albumtype: nil,
    # ``va``: boolean: whether the release has "various artists"
    va: nil,
    # ``year``: release year
    year: nil,
    # ``month``: release month
    month: nil,
    # ``day``: release day
    day: nil,
    # ``label``: music label responsible for the release
    label: nil,
    # ``mediums``: the number of discs in this release
    mediums: nil,
    # ``artist_sort``: name of the release's artist for sorting
    artist_sort: nil,
    # ``releasegroup_id``: MBID for the album's release group
    releasegroup_id: nil,
    # ``catalognum``: the label's catalog number for the release
    catalognum: nil,
    # ``script``: character set used for metadata
    script: nil,
    # ``language``: human language of the metadata
    language: nil,
    # ``country``: the release country
    country: nil,
    # ``albumstatus``: MusicBrainz release status (Official, etc.)
    albumstatus: nil,
    # ``media``: delivery mechanism (Vinyl, etc.)
    media: nil,
    # ``albumdisambig``: MusicBrainz release disambiguation comment
    albumdisambig: nil,
    # ``artist_credit``: Release-specific artist name
    artist_credit: nil,
    original_year: nil,
    original_month: nil,
    original_day: nil,
    # ``data_source``: The original data source (MusicBrainz, Discogs, etc.)
    data_source: nil,
    # ``data_url``: The data source release URL.
    data_url: nil
  ]

  def album_url(album_id), do: "/release/" <> album_id

  def album_info(release) do
    %AlbumInfo{
      album: release["title"],
      album_id: release["id"],
      asin: release["asin"],
      # albumtype, a bit unclear what they are doing here
      mediums: length(release["media"]),
      releasegroup_id: release["release-group"]["id"],
      albumstatus: release["status"],
      albumdisambig:
        release["release-group"]["disambiguation"] <> ", " <> release["disambiguation"],
      media: Enum.at(release["media"], 0) |> Map.get("format"),
      label: Enum.at(release["label-info"], 0) |> Map.get("label") |> Map.get("name"),
      script: release["text-representation"]["script"],
      language: release["text-representation"]["language"],
      data_source: "MusicBrainz",
      data_url: album_url(release["id"])
    }
  end

  @various_artists_id "89ad4ac3-39f7-470e-963a-56509c546377"
  def add_va(album) do
    %{
      album
      | va: album.artist_id == @various_artists_id,
        artist:
          if album.artist_id == @various_artists_id do
            "Various Artists"
          else
            album.artist
          end
    }
  end

  def split_date(date_string) do
    Regex.named_captures(~r/(?<year>\d{4})-(?<month>\d{2})(-(?<day>\d{2}))?/, date_string)
  end

  def add_preferred_release_event(album, %{
        "release-events" => [
          %{
            "date" => release_date,
            "area" => %{"iso-3166-1-code-list" => [country | _]}
          }
          | _
        ],
        "release-group" => %{"first-release-date" => first_release_date}
      }) do
    # This should also do some fancy stuff regarding countries and stuff
    %{"year" => year, "month" => month, "day" => day} = split_date(release_date)

    %{"year" => f_year, "month" => f_month, "day" => f_day} = split_date(first_release_date)

    %{
      album
      | year: year,
        month: month,
        day: day,
        original_year: f_year,
        original_month: f_month,
        original_day: f_day
    }
  end

  def add_preferred_release_event(album, %{
        "release-group" => %{"first-release-date" => release_date}
      }) do
    %{"year" => year, "month" => month, "day" => day} = split_date(release_date)

    %{
      album
      | year: year,
        month: month,
        day: day,
        original_year: year,
        original_month: month,
        original_day: day
    }
  end

  def add_preferred_release_event(album, _), do: album

  def add_media_tracks(album, %{
        "title" => title,
        "position" => position,
        "track-count" => track_count,
        "format" => format,
        "tracks" => tracks
      }) do
    tracks =
      tracks
      |> Enum.with_index()
      |> Enum.map(fn {track, index} ->
        tagged_track =
          AutoTagger.TrackInfo.from_data(
            track["recording"],
            position,
            track["position"],
            length(tracks)
          )

        %{tagged_track | disctitle: title, media: format, track_alt: track["number"]}
        # beets also overwrites some stuff here after
      end)

    %{album | tracks: album.tracks ++ tracks}
  end

  def add_tracks(album, %{"media" => medias}) do
    Enum.reduce(medias, album, fn media, acc_album ->
      add_media_tracks(acc_album, media)
    end)
  end

  def from_data(release) do
    release
    |> album_info
    |> AutoTagger.TrackInfo.add_artist(release)
    |> add_va
    |> add_preferred_release_event(release)
    |> add_tracks(release)
  end
end
