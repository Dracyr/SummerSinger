import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PlayerActions from '../actions/player';
import * as LibraryActions from '../actions/library';
import * as ViewsActions from '../actions/views';

import Summer from '../components/Summer';

function mapState(state) {
  return {
    views: state.views,
    player: state.player,
    library: state.library
  };
}

function mapDispatch(dispatch) {
  return {
    actions:  {
      player:   bindActionCreators(PlayerActions, dispatch),
      library:  bindActionCreators(LibraryActions, dispatch),
      views:    bindActionCreators(ViewsActions, dispatch)
    }
  };
}

export default connect(mapState, mapDispatch)(Summer);
