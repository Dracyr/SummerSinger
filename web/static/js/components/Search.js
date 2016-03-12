import React, { Component } from 'react';
import TrackList from '../components/TrackList';
import { requestQueueTrack } from '../actions/player';

export default class Search extends Component {
  render() {
    const { search, currentId } = this.props;

    return (
      <div>
        <TrackList
          tracks={search}
          keyAttr={"id"}
          currentKey={currentId}
          onClickHandler={(track) => requestQueueTrack(track.id)}/>;
      </div>
    );
  }
}


function mapState(state) {
  return {
    search: state.library.search,
  };
}

function mapDispatch(dispatch) {
  return {
    actions:  bindActionCreators(LibraryActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(Library);
