import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as FolderActions from "./actions";
import * as PlayerActions from "Containers/Player/actions";
import Folder from "Containers/Folders/components/Folder";
import FolderContextMenu from "Containers/Folders/components/FolderContextMenu";
import Track from "Containers/Tracks/components/Track";
import TrackList from "Components/TrackList";
import TrackContextMenu from "Containers/Tracks/components/TrackContextMenu";

class Folders extends Component {
  static propTypes = {
    pathParts: PropTypes.arrayOf(PropTypes.string),
    folder: PropTypes.shape({
      id: PropTypes.number,
      children: PropTypes.array
    }),
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    playerActions: PropTypes.objectOf(PropTypes.func).isRequired,
    currentId: PropTypes.number
  };

  static defaultProps = {
    pathParts: [],
    folder: {},
    currentId: null
  };

  constructor(props) {
    super(props);
    this.state = {
      contextMenu: null,
      selectedTarget: null
    };
  }

  componentDidMount() {
    if (this.props.pathParts.length === 1) {
      this.props.actions.fetchFolder("", true);
    }
  }

  openContextMenu = (target, x, y, type = "track") => {
    this.setState({
      contextMenu: { x, y, type },
      selectedTarget: target
    });
  };

  hideContextMenu = () => {
    this.setState({
      contextMenu: null,
      selectedTarget: null
    });
  };

  selectTarget = target => {
    this.setState({ selectedTarget: target });
  };

  goToParent = () => {
    this.props.actions.goToParent();
  };

  playFolder = folder => {
    this.props.actions.playFolder(folder.id);
  };
  queueFolder = folder => {
    this.props.actions.queueFolder(folder.id);
  };

  renderContextMenu() {
    if (!this.state.contextMenu) {
      return "";
    }

    if (this.state.contextMenu.type === "folder") {
      return (
        <FolderContextMenu
          context={this.state.contextMenu}
          hideContextMenu={this.hideContextMenu}
          playFolder={this.playFolder}
          queueFolder={this.queueFolder}
          folder={this.state.selectedTarget}
        />
      );
    }

    return (
      <TrackContextMenu
        context={this.state.contextMenu}
        hideContextMenu={this.hideContextMenu}
        track={this.state.selectedTarget}
      />
    );
  }

  renderItem = ({ index, key, style }) => {
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
    return (
      <Track
        key={key}
        style={style}
        track={track}
        isPlaying={currentId === track.id}
        isSelected={selectedTarget && selectedTarget.id === track.id}
        selectTrack={this.selectTarget}
        openContextMenu={this.openContextMenu}
        onClickHandler={() =>
          this.props.playerActions.requestQueueAndPlayTrack(track.id)
        }
        index={index}
      />
    );
  };

  render() {
    const { pathParts, folder } = this.props;

    return (
      <div>
        <h1 className="header">Folders</h1>
        <h3>{pathParts.length > 1 ? pathParts.join(" / ") : "/"}</h3>
        <div className="display-table track-list">
          {pathParts.length > 1 && (
            <div key="0-0" className="tr track" onClick={this.goToParent}>
              <div className="td ">..</div>
              <div className="td " />
              <div className="td " />
              <div className="td " />
            </div>
          )}

          <TrackList
            renderItem={this.renderItem}
            totalTracks={folder.children.length + folder.tracks.length}
            renderHeader={() => {}}
          />

          {this.renderContextMenu()}
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    pathParts: state.folders.present.pathParts,
    folder: state.folders.present.folder,
    currentId: state.player.currentTrack && state.player.currentTrack.id
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(FolderActions, dispatch),
    playerActions: bindActionCreators(PlayerActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(Folders);
