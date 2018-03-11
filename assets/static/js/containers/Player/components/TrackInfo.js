import React from "react";
import PropTypes from "prop-types";

const TrackInfo = ({ artist, title, album, filename }) => (
  <div className="track-info">
    <div className="track">{title || filename}</div>
    <div className="meta">
      {artist}
      {album ? ` - ${album}` : ""}
    </div>
  </div>
);

TrackInfo.propTypes = {
  artist: PropTypes.string,
  title: PropTypes.string,
  album: PropTypes.string,
  filename: PropTypes.string
};

TrackInfo.defaultProps = {
  artist: null,
  title: "No track loaded",
  album: null,
  filename: null
};

export default TrackInfo;
