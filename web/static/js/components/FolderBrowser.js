import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactList from 'react-list';
import { ActionCreators } from 'redux-undo';

import * as FolderActions from '../actions/folders';
import * as PlayerActions from '../actions/player';
import { Track } from './TrackList';

class Folders extends Component {
  componentDidMount() {
    if (this.props.pathParts.length === 1) {
      this.props.actions.fetchFolder('', true);
    }
  }

  renderItem(index, key) {
    if (index < this.props.folder.children.length) {
      const child = this.props.folder.children[index];
      return(
        <div className="tr track" key={key} onClick={() => this.props.actions.fetchFolder(child.id)}>
          <div className="td ">{child.title}</div>
          <div className="td "></div>
          <div className="td "></div>
          <div className="td "></div>
        </div>
      );
    } else {
      const trackIndex = index - this.props.folder.children.length;
      const track = this.props.folder.tracks[trackIndex];
      return <Track
                track={track}
                key={key}
                keyAttr={'id'}
                currentKey={this.props.currentKey}
                onClickHandler={(track) => this.props.playerActions.requestQueueTrack(track.id)} />;

    }
  }

  render() {
    const { pathParts, folder, actions} = this.props;
    const folder_parent = pathParts.length > 1 ? (
      <div className="tr track" key={0} onClick={() => this.props.actions.goToParent()}>
        <div className="td ">..</div>
        <div className="td "></div>
        <div className="td "></div>
        <div className="td "></div>
      </div>
    ) : '';
    const totalLength = folder.children.length + folder.tracks.length;
    return (
      <div>
        <h3>{pathParts.length > 1 ? pathParts.join(' / ') : '/'}</h3>
        <div className="display-table track-list">
          <ReactList
            itemRenderer={(index, key) => this.renderItem(index, key)}
            itemsRenderer={(items, ref) => <div className="tbody" ref={ref}>{folder_parent}{items}</div>}
            length={totalLength}
            type='uniform'
          />
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    pathParts: state.folders.present.pathParts,
    folder: state.folders.present.folder
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(FolderActions, dispatch),
    playerActions: bindActionCreators(PlayerActions, dispatch),
  };
}

export default connect(mapState, mapDispatch)(Folders);
