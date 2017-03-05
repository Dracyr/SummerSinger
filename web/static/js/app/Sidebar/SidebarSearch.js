import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


export default class SidebarSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 'Search' };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onBlur = this.handleOnBlur.bind(this);
    this.onFocus = this.handleOnFocus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      this.setState({ value: nextProps.active ? '' : 'Search' });
    }
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ value });
    this.search(value);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.search(this.state.value);
    }
  }

  handleOnBlur() {
    this.setState({ value: 'Search' });
  }

  handleOnFocus() {
    this.setState({ value: '' });
  }

  search(searchTerm) {
    this.props.search(searchTerm);
  }

  render() {
    return (
      <NavLink to="/search" className="search">
        <input
          type="text"
          className="unstyled-input"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
      </NavLink>
    );
  }
}

SidebarSearch.propTypes = {
  active: React.PropTypes.bool,
  search: React.PropTypes.func,
};
