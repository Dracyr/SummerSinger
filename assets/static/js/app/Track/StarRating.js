/* eslint react/no-array-index-key: 0 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateTrack } from './actions';

const conversion = {
  0: 0,
  10: 0.5,
  20: 1,
  30: 1.5,
  40: 2,
  50: 2.5,
  60: 3,
  70: 3.5,
  80: 4,
  90: 4.5,
  100: 5,
};

class StarRating extends PureComponent {
  static propTypes = {
    track: PropTypes.shape({
      rating: PropTypes.number,
      id: PropTypes.number,
    }),
    updateTrack: PropTypes.func.isRequired,
  };

  static defaultProps = {
    track: { rating: 0, id: null },
  };

  constructor() {
    super();
    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.state = {
      hover: false,
    };
  }

  handleOnMouseOver(event) {
    const rect = this.starRating.getBoundingClientRect();
    const hoverStars = ((event.pageX - rect.left) / rect.width) * 5;
    this.setState({
      hover: true,
      hoverStars: Math.round(hoverStars * 2) / 2,
    });
  }

  handleOnMouseLeave() {
    this.setState({
      hover: false,
      hoverStars: null,
    });
  }

  handleOnClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.props.track.id) {
      const rect = this.starRating.getBoundingClientRect();
      let rating = ((event.pageX - rect.left) / rect.width) * 5;
      rating = (Math.round(rating * 2) / 2) * 20;
      this.props.updateTrack(this.props.track.id, { rating });
    }
  }

  render() {
    let stars;
    if (this.state.hover) {
      stars = this.state.hoverStars;
    } else {
      stars = conversion[this.props.track.rating] || 0;
    }
    const halfStar = stars - Math.floor(stars) === 0.5;

    return (
      <a
        tabIndex="-1"
        ref={(c) => { this.starRating = c; }}
        onMouseMove={this.handleOnMouseOver}
        onMouseLeave={this.handleOnMouseLeave}
        onClick={this.handleOnClick}
      >
        {[...Array(Math.floor(stars))].map((x, i) =>
          <i key={i} className="fa fa-star" />,
        )}

        {halfStar ? <i className="fa fa-star-half-o" /> : ''}

        {[...Array(5 - Math.floor(stars) - (halfStar ? 1 : 0))].map((x, i) =>
          <i key={Math.floor(stars) + i} className="fa fa-star-o" />,
        )}
      </a>
    );
  }
}

function mapDispatch(dispatch) {
  return {
    updateTrack: (...args) => dispatch(updateTrack(...args)),
  };
}

export default connect(null, mapDispatch)(StarRating);
