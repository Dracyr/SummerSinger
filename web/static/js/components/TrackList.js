import React, { Component } from 'react';
import InfiniteReactList from '../lib/InfiniteReactList';
import { PlaceholderText, closestSelector } from '../lib/Util';

import StarRating from './StarRating';
import TrackContextMenu from './TrackContextMenu';

import Track from './Track';

export default class TrackList extends Component {
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
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.loadMoreRows = this.loadMoreRows.bind(this);
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

  loadMoreRows(from, size) {
    if (this.props.loadMoreRows) {
      this.props.loadMoreRows(from, size);
    }
  }

  isRowLoaded(index) {
    return this.props.tracks ? !!this.props.tracks[index] : true;
  }

  selectTrack(track, index) {
    this.setState({ selectedTrack: track, selectedIndex: index });
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
    if (this.isRowLoaded(index)) {
      const { tracks, keyAttr, currentKey, onClickHandler } = this.props;
      const track = tracks[index];
      const isPlaying = ((keyAttr === 'index' && index === currentKey) ||
                          (keyAttr === 'id' && track.id === currentKey));

      const isSelected = this.state.selectedTrack && (
        (keyAttr === 'id' && track.id === this.state.selectedTrack.id) ||
        (keyAttr === 'index' && index === this.state.selectedIndex));

      trackComponent = (
        <Track track={track}
          key={key}
          isPlaying={isPlaying}
          isSelected={isSelected}
          onClickHandler={onClickHandler}
          openContextMenu={this.openContextMenu}
          selectTrack={this.selectTrack}
          index={index}
        />);
    } else {
      trackComponent = (
        <div className="tr track" key={key}>
          <div className="td td-title"><div><PlaceholderText /></div></div>
          <div className="td td-artist"><div><PlaceholderText /></div></div>
          <div className="td td-album"><div></div></div>
          <div className="td td-rating"><StarRating rating={0} /></div>
        </div>
      );
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
      return '';
    }

    return (
      <div className="thead">
        <div className="tr">
          <div className="td td-title">
            <span onClick={this.sortTitle}>Title </span>
            <i className={this.renderSortCol('title')} />
          </div>
          <div className="td td-artist">
            <span onClick={this.sortArtist}>Artist </span>
            <i className={this.renderSortCol('artist')} />
          </div>
          <div className="td td-album">
            <span onClick={this.sortAlbum}>Album </span>
            <i className={this.renderSortCol('album')} />
          </div>
          <div className="td td-rating">
            <span onClick={this.sortRating}>Rating </span>
            <i className={this.renderSortCol('rating')} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { tracks, totalTracks, hideHeader } = this.props;
    const localLength = (tracks && tracks.length) || 0;
    const trackCount = totalTracks || localLength;

    // Without arrow functions, will not rerender even if props changed
    const itemRenderer = (index, key) => this.renderItem(index, key);

    const header = this.renderHeader(hideHeader);

    let trackList;
    if (trackCount > 0 || this.props.hideHeader) {
      trackList = (
        <div className="display-table track-list">
          {header}
          <InfiniteReactList
            itemRenderer={itemRenderer}
            itemsRenderer={this.renderItems}
            length={trackCount}
            localLength={localLength || trackCount}
            type="uniform"
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
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
    } else {
      trackList = (
        <div className="no_tracks_banner">
          No tracks.
        </div>
      );
    }

    return trackList;
  }
}

TrackList.propTypes = {
  tracks: React.PropTypes.array,
  keyAttr: React.PropTypes.string,
  currentKey: React.PropTypes.number,
  onClickHandler: React.PropTypes.func,
  onDeleteHandler: React.PropTypes.func,
  totalTracks: React.PropTypes.number,
  loadMoreRows: React.PropTypes.func,
  renderItem: React.PropTypes.func,
  renderItems: React.PropTypes.func,
  hideHeader: React.PropTypes.bool,
  sortTracks: React.PropTypes.func,
  sort: React.PropTypes.object,
};
