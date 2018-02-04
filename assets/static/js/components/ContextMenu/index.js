import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import MenuItem from './components/MenuItem';
import SubMenu from './components/SubMenu';

export { MenuItem, SubMenu };

const menuEl = document.getElementById('menu-container');

function getWindowWidth() {
  return window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
}

export default class ContextMenu extends Component {
  static propTypes = {
    hideContextMenu: PropTypes.func.isRequired,
    context: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }).isRequired,
    children: PropTypes.node,
    validTarget: PropTypes.func,
  }

  static defaultProps = {
    validTarget: () => false,
    children: null,
  }

  constructor() {
    super();

    this.state = { lastClick: Date.now() };
  }

  componentWillMount() {
    this.setState({ lastClick: Date.now() });
  }

  componentDidMount() {
    document.addEventListener('click', this.handleRandomClick);
    document.addEventListener('contextmenu', this.handleDefaultContextMenu);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.context !== this.props.context) {
      this.setState({ lastClick: Date.now() });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleRandomClick);
    document.removeEventListener('contextmenu', this.handleDefaultContextMenu);
  }

  getLeftOffset = (x) => {
    const elementWidth = (this.menuElement && this.menuElement.offsetWidth) || 160;

    return x + elementWidth >= getWindowWidth() ? (x - elementWidth) : x;
  }

  handleRandomClick = (event) => {
    const diff = Date.now() - this.state.lastClick;
    const validTarget = this.props.validTarget(event.target);
    if (!validTarget || (diff > 400 && validTarget)) {
      this.props.hideContextMenu();
    }
  }

  handleDefaultContextMenu = (event) => {
    if (!this.props.validTarget(event.target)) {
      this.props.hideContextMenu();
    }
  }

  render() {
    const style = {
      position: 'fixed',
      left: this.getLeftOffset(this.props.context.x),
      top: this.props.context.y,
    };

    return createPortal(
      <div
        ref={(el) => { this.menuElement = el; }}
        style={style}
        className="context-menu"
      >
        {this.props.children}
      </div>,
      menuEl,
    );
  }
}
