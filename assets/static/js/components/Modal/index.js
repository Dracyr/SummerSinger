import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ title, children }) => (
  <div className="modal visible" data-modal>
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title">{title}</h3>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </div>
  </div>
);

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

Modal.defaultProps = {
  title: '',
  children: null,
};

export default Modal;
