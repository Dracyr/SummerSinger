import React, { Component } from 'react';

export default class StarRating extends Component {

  render() {
    const { rating } = this.props;
    const stars = rating ? Math.floor((rating / 255) * 10) / 2 : 0;
    const halfStar = stars - Math.floor(stars) === 0.5;

    return (
      <span>
        {[...Array(Math.floor(stars) - (halfStar ? 1 : 0))].map((x, i) =>
          <i key={i} className="fa fa-star"></i>
        )}

        {halfStar ? <i className="fa fa-star-half-o"></i> : ''}

        {[...Array(5 - Math.floor(stars))].map( (x,i) =>
          <i key={Math.floor(stars) + i} className="fa fa-star-o"></i>
        )}
      </span>
    );
  }
}
