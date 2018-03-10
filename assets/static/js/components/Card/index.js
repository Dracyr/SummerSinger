import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { PlaceholderText } from "Util";

export const EmptyCard = props => (
  <div className="card" style={props.style}>
    <div className="card-image">
      <img
        src="/images/album_placeholder.png"
        alt="placeholder"
        width="150"
        height="150"
      />
    </div>
    <div className="card-content">
      <PlaceholderText />
    </div>
  </div>
);

const Card = props => {
  const { url, imageUrl, title, subTitle, style } = props;
  return (
    <Link to={url} className="card" style={style}>
      <div className="card-image">
        <img src={imageUrl} alt={title} width="150" height="150" />
      </div>
      <div className="card-content">
        {title}
        <br />
        <small>{subTitle}</small>
      </div>
    </Link>
  );
};

Card.propTypes = {
  url: PropTypes.string,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  style: PropTypes.object
};

export default Card;
