import React, { Component } from 'react';

export default class SidebarItem extends Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.switchView(this.props.itemView);
  }

  render() {
    const { view, itemView } = this.props;
    const isActive = view === itemView ? 'active' : '';

    return (
      <li onClick={this.onClick} className={isActive}>
        {this.props.title}
      </li>
    );
  }
}

SidebarItem.propTypes = {
  switchView: React.PropTypes.func,
  title: React.PropTypes.string,
  view: React.PropTypes.string,
  itemView: React.PropTypes.string,
};

