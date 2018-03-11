import React from "react";
import PropTypes from "prop-types";

const MenuItem = props => {
  const className = props.disabled
    ? "context-menu-item disabled"
    : "context-menu-item";

  return (
    <div className={className}>
      <button onClick={props.onClick} className="context-menu-link">
        {props.children}
      </button>
    </div>
  );
};

MenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool
};

MenuItem.defaultProps = {
  disabled: false
};

export default MenuItem;
