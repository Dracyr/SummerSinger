import React, { Component } from "react";
import PropTypes from "prop-types";

export default class TrackListHeader extends Component {
  static propTypes = {
    sortTracks: PropTypes.func,
    sort: PropTypes.shape({
      sortBy: PropTypes.string,
      dir: PropTypes.string
    }),
    hideAlbum: PropTypes.bool
  };

  static defaultProps = {
    sortTracks: null,
    sort: null,
    hideAlbum: false
  };

  sortTracks = sortBy => {
    if (!this.props.sortTracks) {
      return;
    }
    if (sortBy === this.props.sort.sortBy) {
      const dir = this.props.sort.dir === "asc" ? "desc" : "asc";
      this.props.sortTracks({ sortBy, dir });
    } else {
      this.props.sortTracks({ sortBy, dir: "desc" });
    }
  };

  renderSortCol = column =>
    this.props.sort && this.props.sort.sortBy === column
      ? `fa fa-sort-${this.props.sort.dir}`
      : "";

  render() {
    return (
      <div className="thead">
        <div className="tr">
          <div className="td td-title">
            <span onClick={() => this.sortTracks("title")}>Title </span>
            <i className={this.renderSortCol("title")} />
          </div>
          <div className="td td-artist">
            <span onClick={() => this.sortTracks("artist")}>Artist </span>
            <i className={this.renderSortCol("artist")} />
          </div>
          {!this.props.hideAlbum ? (
            <div className="td td-album">
              <span onClick={() => this.sortTracks("album")}>Album </span>
              <i className={this.renderSortCol("album")} />
            </div>
          ) : null}
          <div className="td td-rating">
            <span onClick={() => this.sortTracks("rating")}>Rating </span>
            <i className={this.renderSortCol("rating")} />
          </div>
        </div>
      </div>
    );
  }
}
