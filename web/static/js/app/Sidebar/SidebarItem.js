import React, { Component } from 'react';

export default class SidebarItem extends Component {
  constructor() {
    super();
    this.isActive = this.isActive.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.switchView(this.props.itemView);
  }

  isActive() {
    const { currentView, itemView } = this.props;
    return currentView === itemView ? 'active' : '';
  }

  render() {
    return (
      <li onClick={this.onClick} className={this.isActive}>
        {this.props.title}
      </li>
    );
  }
}

SidebarItem.propTypes = {
  switchView: React.PropTypes.func,
  title: React.PropTypes.string,
  currentView: React.PropTypes.string,
  itemView: React.PropTypes.string,
};

