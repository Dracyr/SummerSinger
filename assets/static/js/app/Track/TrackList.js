import React, { PureComponent, PropTypes } from 'react';
import InfiniteList from '../Util/InfiniteList';
import { closestSelector } from '../Util/Util';
import Track from './Track';
import TrackContextMenu from './TrackContextMenu';

export default class TrackList extends PureComponent {
  static propTypes = {
    entries: PropTypes.array,
    keyAttr: PropTypes.string,
    currentKey: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    onClickHandler: PropTypes.func,
    onDeleteHandler: PropTypes.func,
    totalTracks: PropTypes.number,
    renderItem: PropTypes.func,
    hideHeader: PropTypes.bool,
    sortTracks: PropTypes.func,
    sort: PropTypes.object,
    onSelectTrack: PropTypes.func,
    hideAlbum: PropTypes.bool,
    loadMoreRows: PropTypes.func,
    displayStatic: PropTypes.bool,
  };

  static defaultProps = {
    entries: [],
    keyAttr: 'id',
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
    loadMoreRows: () => {},
    displayStatic: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      contextMenu: false,
      selectedTrack: null,
      selectedIndex: null,
      sort: { sortBy: 'title', dir: 'asc' },
    };

    this.requestedPages = new Set();

    this.openContextMenu = this.openContextMenu.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.selectTrack = this.selectTrack.bind(this);

    this.sortTracks = this.sortTracks.bind(this);
    this.sortTitle = this.sortTitle.bind(this);
    this.sortArtist = this.sortArtist.bind(this);
    this.sortAlbum = this.sortAlbum.bind(this);
    this.sortRating = this.sortRating.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onDeleteHandler, false);
    document.addEventListener('click', this.onClickHandler, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onDeleteHandler);
    document.removeEventListener('click', this.onClickHandler);
  }

  onDeleteHandler(event) {
    const { selectedTrack } = this.state;
    if (!this.onDeleteHandler || !selectedTrack || event.code !== 'Delete') return;
    this.props.onDeleteHandler(selectedTrack);
  }

  onClickHandler(event) {
    if (this.state.selectedTrack && !closestSelector(event.target, '.track')) {
      this.setState({ selectedTrack: null, selectedIndex: null });
    }
  }

  selectTrack(track, index) {
    this.setState({ selectedTrack: track, selectedIndex: index });
    if (this.props.onSelectTrack) { this.props.onSelectTrack(track); }
  }

  openContextMenu(track, x, y, type = 'track') {
    this.setState({
      contextMenu: { x, y, type },
      selectedTrack: track,
    });
  }

  hideContextMenu() {
    this.setState({
      contextMenu: false,
      selectedTrack: null,
    });
  }

  sortTitle() { this.sortTracks('title'); }
  sortArtist() { this.sortTracks('artist'); }
  sortAlbum() { this.sortTracks('album'); }
  sortRating() { this.sortTracks('rating'); }
  sortTracks(sortBy) {
    if (!this.props.sortTracks) {
      return;
    }
    if (sortBy === this.props.sort.sortBy) {
      const dir = this.props.sort.dir === 'asc' ? 'desc' : 'asc';
      this.props.sortTracks({ sortBy, dir });
    } else {
      this.props.sortTracks({ sortBy, dir: 'desc' });
    }
  }

  renderItem({ index, key, style }) {
    if (this.props.renderItem) {
      return this.props.renderItem({index, key, style});
    }

    let trackComponent = '';
    if (this.props.entries && this.props.entries[index]) {
      const { entries, keyAttr, currentKey, onClickHandler } = this.props;
      const { selectedTrack, selectedIndex } = this.state;

      const track = entries[index];
      const isPlaying = ((keyAttr === 'index' && index === currentKey) ||
                          (keyAttr === 'id' && track.id === currentKey));

      const isSelected = selectedTrack && (
        (keyAttr === 'id' && track.id === selectedTrack.id) ||
        (keyAttr === 'index' && index === selectedIndex));

      trackComponent = (
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
        />);
    } else {
      trackComponent = <Track key={key} style={style} />;
    }
    return trackComponent;
  }

  renderHeader(hideHeader) {
    if (hideHeader) {
      return null;
    }

    const renderSortCol = column => (
      this.props.sort && this.props.sort.sortBy === column ?
        `fa fa-sort-${this.props.sort.dir}` : ''
    );

    return (
      <div className="thead">
        <div className={`tr ${this.props.hideAlbum ? 'hide-album' : ''}`}>
          <div className="td td-title">
            <span onClick={this.sortTitle}>Title </span>
            <i className={renderSortCol('title')} />
          </div>
          <div className="td td-artist">
            <span onClick={this.sortArtist}>Artist </span>
            <i className={renderSortCol('artist')} />
          </div>
          {!this.props.hideAlbum ? (
            <div className="td td-album">
              <span onClick={this.sortAlbum}>Album </span>
              <i className={renderSortCol('album')} />
            </div>
          ) : null}
          <div className="td td-rating">
            <span onClick={this.sortRating}>Rating </span>
            <i className={renderSortCol('rating')} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { entries, totalTracks, hideHeader } = this.props;
    const trackCount = totalTracks || (entries && entries.length) || 0;

    const header = this.renderHeader(hideHeader);
    // const header = this.props.renderHeader();

    if (trackCount === 0 && !this.props.hideHeader) {
      return (
        <div className="display-table track-list">
          {header}
        </div>
      );
    }

    const isRowLoaded = ({ index }) => !!(this.props.entries && this.props.entries[index]);
    let list = '';

    if (this.props.displayStatic) {
      list = this.props.entries.map((e, index) => (
        this.renderItem({ index, key: index })
      ));
    } else {
      list = (
        <InfiniteList
          entryCount={trackCount}
          loadMoreRows={this.props.loadMoreRows}
          isRowLoaded={isRowLoaded}
          rowHeight={40}
          renderItem={this.renderItem}
        />
      );
    }

    return (
      <div className="display-table track-list">
        {header}
        {list}
        {this.state.contextMenu ?
          <TrackContextMenu
            context={this.state.contextMenu}
            hideContextMenu={this.hideContextMenu}
            track={this.state.selectedTrack}
          /> : ''
        }
      </div>
    );
  }
}
