import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = (props) => {
  const className = props.disabled ? 'context-menu-item disabled' : 'context-menu-item';

  return (
    <div className={className}>
      <a
        href="#"
        className="context-menu-link"
        onClick={props.onClick}
      >
        {props.children}
      </a>
    </div>
  );
};

MenuItem.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.string,
  disabled: PropTypes.bool,
};

export default MenuItem;
