import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import InfiniteList from "Components/InfiniteList";
import { closestSelector } from "Util";
import Track from "Containers/Tracks/components/Track";
import TrackContextMenu from "./TrackContextMenu";

export default class TrackList extends PureComponent {
  static propTypes = {
    entries: PropTypes.array,
    keyAttr: PropTypes.string,
    currentKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onClickHandler: PropTypes.func,
    onDeleteHandler: PropTypes.func,
    totalTracks: PropTypes.number,
    renderItem: PropTypes.func,
    renderHeader: PropTypes.func,
    renderList: PropTypes.func,
    sortTracks: PropTypes.func,
    sort: PropTypes.object,
    onSelectTrack: PropTypes.func,
    loadMoreRows: PropTypes.func,
    trackIds: PropTypes.arrayOf(PropTypes.number),
    tracksById: PropTypes.objectOf(PropTypes.object)
  };

  static defaultProps = {
    entries: [],
    keyAttr: "id",
    currentKey: null,
    hideAlbum: false,
    onClickHandler: () => {},
    onDeleteHandler: () => {},
    totalTracks: null,
    renderItem: null,
    hideHeader: false,
    sortTracks: null,
    sort: null,
    onSelectTrack: () => {},
    loadMoreRows: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      contextMenu: false,
      selectedTrack: null,
      selectedIndex: null,
      sort: { sortBy: "title", dir: "asc" }
    };

    this.requestedPages = new Set();
  }

  componentDidMount() {
    document.addEventListener("keyup", this.onDeleteHandler, false);
    document.addEventListener("click", this.onClickHandler, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.onDeleteHandler);
    document.removeEventListener("click", this.onClickHandler);
  }

  onDeleteHandler = event => {
    const { selectedTrack } = this.state;
    if (!this.onDeleteHandler || !selectedTrack || event.code !== "Delete")
      return;
    this.props.onDeleteHandler(selectedTrack);
  };

  onClickHandler = event => {
    if (this.state.selectedTrack && !closestSelector(event.target, ".track")) {
      this.setState({ selectedTrack: null, selectedIndex: null });
    }
  };

  selectTrack = (track, index) => {
    this.setState({ selectedTrack: track, selectedIndex: index });
    if (this.props.onSelectTrack) {
      this.props.onSelectTrack(track);
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

  sortTracks = sortBy => {
    if (!this.props.sortTracks) {
      return;
    }
    if (sortBy === this.props.sort.sortBy) {
      const dir = this.props.sort.dir === "asc" ? "desc" : "asc";
      this.props.sortTracks({ sortBy, dir });
    } else {
      this.props.sortTracks({ sortBy, dir: "desc" });
    }
  };

  isRowLoaded = ({ index }) =>
    !!(this.props.entries && this.props.entries[index]);

  renderSortCol = column =>
    this.props.sort && this.props.sort.sortBy === column
      ? `fa fa-sort-${this.props.sort.dir}`
      : "";

  renderHeader = () => (
    <div className="thead">
      <div className="tr">
        <div className="td td-title">
          <span onClick={() => this.sortTracks("title")}>Title </span>
          <i className={this.renderSortCol("title")} />
        </div>
        <div className="td td-artist">
          <span onClick={() => this.sortTracks("artist")}>Artist </span>
          <i className={this.renderSortCol("artist")} />
        </div>
        {!this.props.hideAlbum ? (
          <div className="td td-album">
            <span onClick={() => this.sortTracks("album")}>Album </span>
            <i className={this.renderSortCol("album")} />
          </div>
        ) : null}
        <div className="td td-rating">
          <span onClick={() => this.sortTracks("rating")}>Rating </span>
          <i className={this.renderSortCol("rating")} />
        </div>
      </div>
    </div>
  );

  renderItem = ({ index, key, style }) => {
    if (this.props.renderItem) {
      return this.props.renderItem({ index, key, style });
    }

    const trackId = this.props.trackIds[index];
    const track = this.props.tracksById[trackId];

    if (track) {
      const { keyAttr, currentKey, onClickHandler } = this.props;
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
          key={key}
          style={style}
          isPlaying={isPlaying}
          isSelected={isSelected}
          onClickHandler={onClickHandler}
          openContextMenu={this.openContextMenu}
          selectTrack={this.selectTrack}
          updateTrack={this.updateTrack}
          hideAlbum={this.props.hideAlbum}
        />
      );
    }
    return null;
  };

  render() {
    const { trackIds, totalTracks } = this.props;
    const trackCount = totalTracks || (trackIds && trackIds.length) || 0;
    const header = this.props.renderHeader
      ? this.props.renderHeader()
      : this.renderHeader();

    if (trackCount === 0) {
      return <div className="display-table track-list">{header}</div>;
    }

    return (
      <div className="display-table track-list">
        {header}
        {this.props.renderList ? (
          this.props.renderList({
            entries: this.props.entries,
            renderItem: this.renderItem
          })
        ) : (
          <InfiniteList
            entryCount={trackCount}
            loadMoreRows={this.props.loadMoreRows}
            isRowLoaded={this.isRowLoaded}
            rowHeight={40}
            renderItem={this.renderItem}
            additionalKeys={{ ...this.props.sort }}
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
