import React, { PureComponent, PropTypes } from 'react';

const Modal = (props) => (
  <div className="modal visible">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title">{props.title}</h3>
      </div>
      <div className="modal-body">
        {props.children}
      </div>
    </div>
  </div>
);

export default Modal;
