import React, { PureComponent, PropTypes } from 'react';
import ReactList from 'react-list';
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
    renderItems: PropTypes.func,
    hideHeader: PropTypes.bool,
    sortTracks: PropTypes.func,
    sort: PropTypes.object,
    onSelectTrack: PropTypes.func,
    hideAlbum: PropTypes.bool,
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
    renderItems: null,
    hideHeader: false,
    sortTracks: () => {},
    sort: null,
    onSelectTrack: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      contextMenu: false,
      selectedTrack: null,
      selectedIndex: null,
      sort: { sortBy: 'title', dir: 'asc' },
    };

    this.openContextMenu = this.openContextMenu.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderItems = this.renderItems.bind(this);

    this.selectTrack = this.selectTrack.bind(this);

    this.sortTracks = this.sortTracks.bind(this);
    this.sortTitle = this.sortTitle.bind(this);
    this.sortArtist = this.sortArtist.bind(this);
    this.sortAlbum = this.sortAlbum.bind(this);
    this.sortRating = this.sortRating.bind(this);
  }

  componentWillMount() {
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

  getEntryList() {
    return this.entryList;
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

  sortTitle() {
    this.sortTracks('title');
  }

  sortArtist() {
    this.sortTracks('artist');
  }

  sortAlbum() {
    this.sortTracks('album');
  }

  sortRating() {
    this.sortTracks('rating');
  }

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

  renderItem(index, key) {
    if (this.props.renderItem) {
      return this.props.renderItem(index, key);
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
          isPlaying={isPlaying}
          isSelected={isSelected}
          onClickHandler={onClickHandler}
          openContextMenu={this.openContextMenu}
          selectTrack={this.selectTrack}
          updateTrack={this.updateTrack}
          hideAlbum={this.props.hideAlbum}
        />);
    } else {
      trackComponent = <Track key={key} />;
    }
    return trackComponent;
  }

  renderItems(items, ref) {
    if (this.props.renderItems) {
      return this.props.renderItems(items, ref);
    }
    return <div className="tbody" ref={ref}>{items}</div>;
  }

  renderSortCol(column) {
    if (this.props.sort && this.props.sort.sortBy === column) {
      return `fa fa-sort-${this.props.sort.dir}`;
    }
    return '';
  }

  renderHeader(hideHeader) {
    if (hideHeader) {
      return null;
    }

    return (
      <div className="thead">
        <div className={`tr ${this.props.hideAlbum ? 'hide-album' : ''}`}>
          <div className="td td-title">
            <span onClick={this.sortTitle}>Title </span>
            <i className={this.renderSortCol('title')} />
          </div>
          <div className="td td-artist">
            <span onClick={this.sortArtist}>Artist </span>
            <i className={this.renderSortCol('artist')} />
          </div>
          {!this.props.hideAlbum ? (
            <div className="td td-album">
              <span onClick={this.sortAlbum}>Album </span>
              <i className={this.renderSortCol('album')} />
            </div>
          ) : null}
          <div className="td td-rating">
            <span onClick={this.sortRating}>Rating </span>
            <i className={this.renderSortCol('rating')} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { entries, totalTracks, hideHeader } = this.props;
    const localLength = (entries && entries.length) || 0;
    const trackCount = totalTracks || localLength;

    const header = this.renderHeader(hideHeader);

    if (trackCount === 0 && !this.props.hideHeader) {
      return (
        <div className="display-table track-list">
          {header}
        </div>
      );
    }

    return (
      <div className="display-table track-list">
        {header}
        <ReactList
          itemRenderer={this.renderItem}
          itemsRenderer={this.renderItems}
          length={trackCount}
          localLength={localLength || trackCount}
          type="uniform"
          ref={(c) => { this.entryList = c; }}
          useStaticSize
          useTranslate3d
        />
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
