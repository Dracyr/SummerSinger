import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ImportLibrary from './ImportLibrary';
import Modal from '../../Util/Modal';

const modalContainer = document.getElementById('modal-container');

export default class NewLibraryModal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalContainer.appendChild(this.el);
    document.addEventListener('click', (event) => {
      if (event.target.dataset.modal) {
        this.props.submit(null);
      }
    });
  }

  componentWillUnmount() {
    modalContainer.removeChild(this.el);
  }

  // submit(path) {
  //   this.props.submit(path);
  // }

  render() {
    return ReactDOM.createPortal(
      <Modal title="Add Library">
        <ImportLibrary submit={path => this.submit(path)} />
      </Modal>,
      this.el,
    );
  }
}
