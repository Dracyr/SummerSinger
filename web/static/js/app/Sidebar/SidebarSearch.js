import React, { Component } from 'react';

export default class SidebarSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 'Search' };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.switchViewToSearch = this.switchViewToSearch.bind(this);
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

  search(searchTerm) {
    this.props.search(searchTerm);
  }

  switchViewToSearch() {
    this.props.switchView('SEARCH');
  }

  render() {
    return (
      <li onClick={this.switchViewToSearch}
        className={this.props.active ? 'search active' : 'search'}
      >
        <input type="text" className="unstyled-input"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </li>
    );
  }
}

SidebarSearch.propTypes = {
  active: React.PropTypes.bool,
  search: React.PropTypes.func,
  switchView: React.PropTypes.func,
};
