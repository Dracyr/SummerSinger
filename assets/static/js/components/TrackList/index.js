import React, { Component } from "react";
import PropTypes from "prop-types";
import InfiniteList from "Components/InfiniteList";
import Track, { EmptyTrack } from "Containers/Tracks/components/Track";
import TrackContextMenu from "Containers/Tracks/components/TrackContextMenu";
import TrackListHeader from "./components/TrackListHeader";

export default class TrackList extends Component {
  static propTypes = {
    keyAttr: PropTypes.string,
    currentKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onClickHandler: PropTypes.func,
    onDeleteHandler: PropTypes.func,
    totalTracks: PropTypes.number,
    renderItem: PropTypes.func,
    renderHeader: PropTypes.func,
    sortTracks: PropTypes.func,
    sort: PropTypes.shape({
      sortBy: PropTypes.string,
      dir: PropTypes.string
    }),
    onSelectTrack: PropTypes.func,
    loadMoreRows: PropTypes.func,
    trackIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    tracksById: PropTypes.objectOf(PropTypes.object).isRequired,
    hideAlbum: PropTypes.bool,
    staticList: PropTypes.bool
  };

  static defaultProps = {
    keyAttr: "id",
    currentKey: null,
    onClickHandler: () => {},
    onDeleteHandler: () => {},
    totalTracks: null,
    renderItem: null,
    renderHeader: null,
    sortTracks: null,
    sort: null,
    onSelectTrack: () => {},
    loadMoreRows: () => {},
    hideAlbum: false,
    staticList: false
  };

  constructor() {
    super();

    this.state = {
      contextMenu: false,
      selectedTrack: null,
      selectedIndex: null
    };
  }

  componentDidMount() {
    document.addEventListener("keyup", this.onDeleteHandler, false);
    document.addEventListener("click", this.handleOnClickGlobal, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.onDeleteHandler);
    document.removeEventListener("click", this.handleOnClickGlobal);
  }

  onDeleteHandler = event => {
    const { selectedTrack } = this.state;

    if (
      this.props.onDeleteHandler &&
      selectedTrack &&
      event.code === "Delete"
    ) {
      this.props.onDeleteHandler(selectedTrack);
    }
  };

  handleOnClickGlobal = event => {
    if (!event.defaultPrevented) {
      this.setState({ selectedTrack: null, selectedIndex: null });
    }
  };

  handleOnClick = (track, index) => {
    if (this.state.selectedIndex === index) {
      this.props.onClickHandler(track);
    } else {
      this.setState({ selectedTrack: track, selectedIndex: index });
      if (this.props.onSelectTrack) {
        this.props.onSelectTrack(track);
      }
    }
  };

  openContextMenu = (track, x, y, type = "track") => {
    this.setState({
      contextMenu: { x, y, type },
      selectedTrack: track
    });
  };

  hideContextMenu = () => {
    this.setState({
      contextMenu: false,
      selectedTrack: null
    });
  };

  isRowLoaded = ({ index }) =>
    this.props.tracksById[this.props.trackIds[index]];

  renderItem = ({ index, key, style }) => {
    if (this.props.renderItem) {
      return this.props.renderItem({ index, key, style });
    }

    const track = this.props.tracksById[this.props.trackIds[index]];
    if (!track) {
      return <EmptyTrack key={`i-${index}`} />;
    }

    const { keyAttr, currentKey } = this.props;
    const { selectedTrack, selectedIndex } = this.state;

    const isPlaying =
      (keyAttr === "index" && index === currentKey) ||
      (keyAttr === "id" && track.id === currentKey);

    const isSelected =
      selectedTrack &&
      ((keyAttr === "id" && track.id === selectedTrack.id) ||
        (keyAttr === "index" && index === selectedIndex));

    return (
      <Track
        track={track}
        index={index}
        key={key || `${index}-${track.id}`}
        style={style}
        isPlaying={isPlaying}
        isSelected={isSelected}
        handleOnClick={this.handleOnClick}
        openContextMenu={this.openContextMenu}
        selectTrack={this.selectTrack}
        updateTrack={this.updateTrack}
        hideAlbum={this.props.hideAlbum}
      />
    );
  };

  render() {
    const { trackIds, totalTracks } = this.props;
    const trackCount = totalTracks || (trackIds && trackIds.length) || 0;

    const header = this.props.renderHeader ? (
      this.props.renderHeader()
    ) : (
      <TrackListHeader
        sort={this.props.sort}
        sortTracks={this.props.sortTracks}
        hideAlbum={this.props.hideAlbum}
      />
    );

    if (trackCount === 0) {
      return <div className="display-table track-list">{header}</div>;
    }

    return (
      <div className="display-table track-list">
        {header}

        {this.props.staticList ? (
          [...Array(trackCount)].map((_x, index) => this.renderItem({ index }))
        ) : (
          <InfiniteList
            entryCount={trackCount}
            loadMoreRows={this.props.loadMoreRows}
            isRowLoaded={this.isRowLoaded}
            rowHeight={40}
            renderItem={this.renderItem}
            additionalKeys={{
              ...this.props.sort,
              index: this.state.selectedIndex,
              track: this.state.selectedTrack
            }}
          />
        )}

        {this.state.contextMenu ? (
          <TrackContextMenu
            context={this.state.contextMenu}
            hideContextMenu={this.hideContextMenu}
            track={this.state.selectedTrack}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
