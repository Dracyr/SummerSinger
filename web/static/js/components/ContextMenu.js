import React, { Component } from 'react';

export default class ContextMenu extends Component {
  constructor() {
    super();
    this.onRandomClick = this.onRandomClick.bind(this);
    this.getLeftOffset = this.getLeftOffset.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.onRandomClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onRandomClick);
  }

  onRandomClick(event) {
    if (!event.defaultPrevented) {
      this.props.hideContextMenu();
    }
  }

  getLeftOffset(x) {
    const windowWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    const elementWidth = (this.refs.rootMenu && this.refs.rootMenu.offsetWidth) || 160;

    return x + elementWidth >= windowWidth ? (x - elementWidth) : x;
  }

  render() {
    const style = {
      position: 'fixed',
      left: this.getLeftOffset(this.props.context.x),
      top: this.props.context.y,
    };

    return (
      <div style={style} ref="rootMenu" className="context-menu">
        {this.props.children}
      </div>
    );
  }
}

ContextMenu.propTypes = {
  hideContextMenu: React.PropTypes.func,
  context: React.PropTypes.object,
  children: React.PropTypes.array,
};

export const MenuItem = (props) => {
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
  onClick: React.PropTypes.func,
  children: React.PropTypes.string,
  disabled: React.PropTypes.bool,
};

export class Submenu extends Component {
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

Submenu.propTypes = {
  title: React.PropTypes.string,
  children: React.PropTypes.array,
};


