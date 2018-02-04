import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SubMenu extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isVisible !== nextState.visible;
  }

  componentWillUnmount() {
    clearTimeout(this.closetimer);
  }

  handleMouseEnter() {
    if (this.closetimer) clearTimeout(this.closetimer);
    if (this.state.visible) return;

    this.opentimer = setTimeout(() => this.setState({ visible: true }), 10);
  }

  handleMouseLeave() {
    if (this.opentimer) clearTimeout(this.opentimer);
    if (!this.state.visible) return;

    this.closetimer = setTimeout(() => this.setState({ visible: false }), 500);
  }

  handleLinkClick(event) {
    event.preventDefault();
    this.setState({ visible: true });
  }

  leftOverflow() {
    const { subMenu, rootMenu } = this.refs;

    const windowWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    const elementWidth = (subMenu && subMenu.offsetWidth) || 160;

    return rootMenu.getBoundingClientRect().right + elementWidth > windowWidth;
  }

  render() {
    const subMenuStyle = {
      visibility: !this.state.visible ? 'hidden' : 'initial',
    };

    if (this.state.visible) {
      subMenuStyle[this.leftOverflow() ? 'right' : 'left'] = '100%';
    }

    return (
      <div ref="rootMenu"
        className="context-menu-item submenu"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <a href="#"
          className="context-menu-link"
          onClick={this.handleLinkClick}
        >
          {this.props.title}
        </a>
        <div className="context-menu" style={subMenuStyle} ref="subMenu">
          {this.props.children}
        </div>
      </div>
    );
  }
}

SubMenu.propTypes = {
  title: PropTypes.string,
  children: PropTypes.array,
};


