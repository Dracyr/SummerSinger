import React, { PureComponent, PropTypes } from 'react';

import ImportLibrary from './ImportLibrary';
import Modal from '../../Util/Modal';

export default class NewLibraryModal extends PureComponent {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
  }

  submit(path) {
    this.props.submit(path);
    this.props.closePortal();
  }

  render() {
    return (
      <Modal title="Add Library">
        <ImportLibrary submit={this.submit} />
      </Modal>
    );
  }
}
