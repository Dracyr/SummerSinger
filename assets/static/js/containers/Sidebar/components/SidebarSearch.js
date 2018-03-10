import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

class SidebarSearch extends Component {
  static propTypes = {
    search: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = { value: "Search" };
  }

  handleChange = event => {
    const { value } = event.target;
    this.setState({ value });

    if (value.length >= 1) {
      this.props.search(value);
    }
  };

  handleKeyPress = event => {
    if (event.key === "Enter" && this.state.value >= 1) {
      this.props.search(this.state.value);
    }
  };

  handleFocus = () => {
    if (this.props.location.pathname !== "/search") {
      this.props.history.push("/search");
    }
    this.setState({ value: "" });
  };

  render() {
    return (
      <input
        type="text"
        className="search-input"
        value={
          this.props.location.pathname === "/search"
            ? this.state.value
            : "Search"
        }
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
      />
    );
  }
}

export default withRouter(SidebarSearch);
