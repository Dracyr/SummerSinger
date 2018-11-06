import { IMPORTER_UPDATE } from "./actions";

const initialPlayer = {
  album: null,
  matchedAlbums: [
    {
      score: 0.94,
      album_info: {
        script: "Latn",
        releasegroup_id: "aa997ea0-2936-40bd-884d-3af8a0e064dc",
        original_year: "2013",
        original_month: "05",
        original_day: "17",
        month: "05",
        mediums: 1,
        media: "Digital Media",
        language: "eng",
        label: null,
        day: "17",
        data_url: "/release/2884cdca-ef0e-4573-acc5-777aa60aa12d",
        data_source: "MusicBrainz",
        country: null,
        catalognum: null,
        asin: null,
        artist_sort: "Daft Punk",
        artist_id: "056e4f3e-d505-4dad-8ec1-d04f521cbb56",
        artist_credit: "Daft Punk",
        artist: "Daft Punk",
        albumtype: null,
        albumstatus: "Official",
        albumdisambig: ", YouTube playlist",
        album_id: "2884cdca-ef0e-4573-acc5-777aa60aa12d",
        album: "Random Access Memories",
        year: "2013",
        va: false
      },
      track_pairs: [
        {
          index: 0,
          score: 0.92,
          stored_track: {},
          matched_track: {}
        }
      ],
      extra_tracks: [
        {
          track_id: "0c871a4a-efdf-47f8-98c2-cc277f806d2f",
          track_alt: "1",
          title: "Give Life Back to Music",
          medium_total: 13,
          medium_index: 1,
          medium: 1,
          media: "Digital Media",
          lyricist: null,
          length: 274.0,
          index: null,
          id: "0c871a4a-efdf-47f8-98c2-cc277f806d2f",
          disctitle: "",
          data_url: "/recording/0c871a4a-efdf-47f8-98c2-cc277f806d2f",
          data_source: "MusicBrainz",
          composer_sort: null,
          composer: null,
          artist_sort: "Nile Rodgers Daft Punk",
          artist_id: "056e4f3e-d505-4dad-8ec1-d04f521cbb56",
          artist_credit: "Nile Rodgers Daft Punk",
          artist: "Nile Rodgers Daft Punk",
          arranger: null
        },
        {
          track_id: "294a1b4d-ebc0-4b03-be25-6171d382cb58",
          track_alt: "2",
          title: "The Game of Love",
          medium_total: 13,
          medium_index: 2,
          medium: 1,
          media: "Digital Media",
          lyricist: null,
          length: 321.0,
          index: null,
          id: "294a1b4d-ebc0-4b03-be25-6171d382cb58",
          disctitle: "",
          data_url: "/recording/294a1b4d-ebc0-4b03-be25-6171d382cb58",
          data_source: "MusicBrainz",
          composer_sort: null,
          composer: null,
          artist_sort: "Daft Punk",
          artist_id: "056e4f3e-d505-4dad-8ec1-d04f521cbb56",
          artist_credit: "Daft Punk",
          artist: "Daft Punk",
          arranger: null
        }
      ]
    }
  ]
};

export default function importer(state = initialPlayer, action) {
  switch (action.type) {
    case IMPORTER_UPDATE:
      return {
        ...state,
        album: action.data.album,
        matchedAlbums: action.data.matched_albums
      };
    default:
      return state;
  }
}
