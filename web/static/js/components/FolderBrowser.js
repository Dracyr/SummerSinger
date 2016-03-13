import React, { Component } from 'react';
import InfiniteReactList from '../lib/InfiniteReactList';

export default class FolderBrowser extends Component {
  isRowLoaded(index) {
  }

  loadMoreRows(from, size) {
  }

  renderItem(index, key) {

  }

  render() {
    return (
      <div>
        <h1>Folders / </h1>
        <div className="display-table track-list">
          <div className="tbody">
            <div className="tr track">
              <div className="td td-title">asd</div>
              <div className="td td-artist"></div>
              <div className="td td-album"></div>
              <div className="td td-rating"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
