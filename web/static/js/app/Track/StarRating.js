import React, { Component, PropTypes } from 'react';

class StarRating extends Component {
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
    const rect = this.refs.starRating.getBoundingClientRect();
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
    const rect = this.refs.starRating.getBoundingClientRect();
    let rating = ((event.pageX - rect.left) / rect.width) * 5;
    rating = (Math.round(rating * 2) / 2) * 20;
    event.preventDefault();
    event.stopPropagation();
    this.props.updateTrack({ rating });
  }

  render() {
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
    let stars;
    if (this.state.hover) {
      stars = this.state.hoverStars;
    } else {
      stars = conversion[this.props.rating] || 0;
    }
    const halfStar = stars - Math.floor(stars) === 0.5;


    return (
      <span
        ref="starRating"
        onMouseMove={this.handleOnMouseOver}
        onMouseLeave={this.handleOnMouseLeave}
        onClick={this.handleOnClick}
      >
        {[...Array(Math.floor(stars))].map((x, i) =>
          <i key={i} className="fa fa-star"></i>
        )}

        {halfStar ? <i className="fa fa-star-half-o"></i> : ''}

        {[...Array(5 - Math.floor(stars) - (halfStar ? 1 : 0))].map((x, i) =>
          <i key={Math.floor(stars) + i} className="fa fa-star-o"></i>
        )}
      </span>
    );
  }
}

StarRating.propTypes = {
  rating: PropTypes.number,
  updateTrack: PropTypes.func,
};

export default StarRating;
