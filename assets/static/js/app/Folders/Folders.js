import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FolderActions from './actions';
import * as PlayerActions from '../Player/actions';
import Folder from './Folder';
import Track from '../Track/Track';
import TrackList from '../Track/TrackList';
import FolderContextMenu from './FolderContextMenu';
import TrackContextMenu from '../Track/TrackContextMenu';

class Folders extends PureComponent {
  static propTypes = {
    pathParts: PropTypes.array,
    folder: PropTypes.object,
    actions: PropTypes.object,
    currentId: PropTypes.number,
    playerActions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      contextMenu: null,
      selectedTarget: null,
    };

    this.openContextMenu = this.openContextMenu.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);
    this.renderItem = this.renderItem.bind(this);
    // this.renderItems = this.renderItems.bind(this);
    this.selectTarget = this.selectTarget.bind(this);
    this.goToParent = this.goToParent.bind(this);
    this.playFolder = this.playFolder.bind(this);
    this.queueFolder = this.queueFolder.bind(this);
  }

  componentDidMount() {
    if (this.props.pathParts.length === 1) {
      this.props.actions.fetchFolder('', true);
    }
  }

  openContextMenu(target, x, y, type = 'track') {
    this.setState({
      contextMenu: { x, y, type },
      selectedTarget: target,
    });
  }

  hideContextMenu() {
    this.setState({
      contextMenu: null,
      selectedTarget: null,
    });
  }

  selectTarget(target) {
    this.setState({ selectedTarget: target });
  }

  goToParent() {
    this.props.actions.goToParent();
  }

  playFolder(folder) {
    this.props.actions.playFolder(folder.id);
  }
  queueFolder(folder) {
    this.props.actions.queueFolder(folder.id);
  }

  renderContextMenu() {
    let contextMenu = '';
    if (this.state.contextMenu) {
      if (this.state.contextMenu.type === 'folder') {
        contextMenu = (
          <FolderContextMenu
            context={this.state.contextMenu}
            hideContextMenu={this.hideContextMenu}
            playFolder={this.playFolder}
            queueFolder={this.queueFolder}
            folder={this.state.selectedTarget}
          />);
      } else {
        contextMenu = (
          <TrackContextMenu
            context={this.state.contextMenu}
            hideContextMenu={this.hideContextMenu}
            track={this.state.selectedTarget}
          />);
      }
    }
    return contextMenu;
  }

  renderItem({ index, key, style }) {
    if (index < this.props.folder.children.length) {
      return (
        <Folder
          key={key}
          style={style}
          folder={this.props.folder.children[index]}
          fetchFolder={this.props.actions.fetchFolder}
          openContextMenu={this.openContextMenu}
        />
      );
    }

    const { folder, currentId } = this.props;
    const { selectedTarget } = this.state;

    const trackIndex = index - folder.children.length;
    const track = folder.tracks[trackIndex];
    const playTrack = () => this.props.playerActions.requestQueueAndPlayTrack(track.id);
    return (
      <Track
        key={key}
        style={style}
        track={track}
        isPlaying={currentId === track.id}
        isSelected={selectedTarget && selectedTarget.id === track.id}
        selectTrack={this.selectTarget}
        openContextMenu={this.openContextMenu}
        onClickHandler={playTrack}
        index={index}
      />
    );
  }

  render() {
    const { pathParts, folder } = this.props;

    const totalLength = folder.children.length + folder.tracks.length;
    const contextMenu = this.renderContextMenu();

    const folderParent = this.props.pathParts.length > 1 ? (
      <div key={'0-0'} className="tr track" onClick={this.goToParent}>
        <div className="td " >..</div>
        <div className="td " />
        <div className="td " />
        <div className="td " />
      </div>
    ) : '';

    return (
      <div>
        <h1 className="header">Folders</h1>
        <h3>{pathParts.length > 1 ? pathParts.join(' / ') : '/'}</h3>
        <div className="display-table track-list">
          {folderParent}
          <TrackList
            renderItem={this.renderItem}
            totalTracks={totalLength}
            renderHeader={() => {}}
          />
          {contextMenu}
        </div>
      </div>
    );
  }
}

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
