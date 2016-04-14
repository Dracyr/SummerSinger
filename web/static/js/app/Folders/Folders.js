import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FolderActions from './actions';
import * as PlayerActions from '../Player/actions';
import Track from '../../components/Track';
import TrackList from '../../components/TrackList';
import TrackContextMenu from '../../components/TrackContextMenu';

class Folders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contextMenu: false,
      selectedTrack: null,
    };

    this.openContextMenu = this.openContextMenu.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.selectTrack = this.selectTrack.bind(this);
    this.goToParent = this.goToParent.bind(this);
  }

  componentDidMount() {
    if (this.props.pathParts.length === 1) {
      this.props.actions.fetchFolder('', true);
    }
  }

  openContextMenu(track, x, y) {
    this.setState({
      contextMenu: { x, y },
      selectedTrack: track,
    });
  }

  hideContextMenu() {
    this.setState({
      contextMenu: false,
      selectedTrack: null,
    });
  }

  selectTrack(track) {
    this.setState({ selectedTrack: track });
  }

  goToParent() {
    this.props.actions.goToParent();
  }

  renderItem(index, key) {
    if (index < this.props.folder.children.length) {
      const child = this.props.folder.children[index];
      return (
        <div key={key}
          className="tr track"
          onClick={() => this.props.actions.fetchFolder(child.id)}
        >
          <div className="td ">{child.title}</div>
          <div className="td "></div>
          <div className="td "></div>
          <div className="td "></div>
        </div>
      );
    } else {
      const { folder, currentId } = this.props;
      const { selectedTrack } = this.state;

      const trackIndex = index - folder.children.length;
      const track = folder.tracks[trackIndex];

      return (<Track key={key}
        track={track}
        isPlaying={currentId === track.id}
        isSelected={selectedTrack && selectedTrack.id === track.id}
        selectTrack={this.selectTrack}
        openContextMenu={this.openContextMenu}
        onClickHandler={(track) => this.props.playerActions.requestQueueAndPlayTrack(track.id)} />);
    }
  }

  renderItems(items, ref) {
    const { pathParts, folder, actions } = this.props;
    const folderParent = pathParts.length > 1 ? (
      <div key={0}
        className="tr track"
        onClick={this.goToParent}
      >
        <div className="td ">..</div>
        <div className="td "></div>
        <div className="td "></div>
        <div className="td "></div>
      </div>
    ) : '';

    return <div className="tbody" ref={ref}>{folderParent}{items}</div>;
  }

  render() {
    const { pathParts, folder } = this.props;

    const totalLength = folder.children.length + folder.tracks.length;
    return (
      <div>
        <h3>{pathParts.length > 1 ? pathParts.join(' / ') : '/'}</h3>
        <div className="display-table track-list">
          <TrackList
            renderItem={this.renderItem}
            renderItems={this.renderItems}
            totalTracks={totalLength}
            hideHeader
          />
          {this.state.contextMenu ?
            <TrackContextMenu
              context={this.state.contextMenu}
              hideContextMenu={this.hideContextMenu}
              track={this.state.selectedTrack}
            /> : ''
          }
        </div>
      </div>
    );
  }
}

Folders.propTypes = {
  pathParts: PropTypes.array,
  folder: PropTypes.object,
  actions: PropTypes.object,
};

function mapState(state) {
  return {
    pathParts: state.folders.present.pathParts,
    folder: state.folders.present.folder,
    currentId: state.player.currentTrack && state.player.currentTrack.id,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(FolderActions, dispatch),
    playerActions: bindActionCreators(PlayerActions, dispatch),
  };
}

export default connect(mapState, mapDispatch)(Folders);
