import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { fetchLibraries, addLibrary } from "Containers/Settings/actions";
import NewLibraryModal from "./components/NewLibraryModal";

class LibrarySettings extends PureComponent {
  static propTypes = {
    fetchLibraries: PropTypes.func.isRequired,
    addLibrary: PropTypes.func.isRequired,
    libraries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        path: PropTypes.string
      })
    ).isRequired
  };

  constructor() {
    super();
    this.state = {
      addLibraryOpen: false
    };

    this.addLibrary = this.addLibrary.bind(this);
  }

  componentDidMount() {
    this.props.fetchLibraries();
  }

  addLibrary(path) {
    this.setState({ addLibraryOpen: false });
    if (path) {
      this.props.addLibrary(path);
    }
  }

  render() {
    return (
      <div>
        <h3>Libraries</h3>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <td>
                <b>Title</b>
              </td>
              <td>
                <b>Path</b>
              </td>
              <td />
            </tr>
          </thead>
          <tbody>
            {this.props.libraries.map(library => (
              <tr key={library.id}>
                <td>{library.title}</td>
                <td>{library.path}</td>
                <td>
                  <button>Rescan</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => this.setState({ addLibraryOpen: true })}>
          Add Library
        </button>

        {this.state.addLibraryOpen && (
          <NewLibraryModal submit={this.addLibrary} />
        )}
      </div>
    );
  }
}

function mapState(state) {
  return {
    libraries: state.settings.libraryIds.map(
      libraryId => state.settings.libraryById[libraryId]
    )
  };
}

function mapDispatch(dispatch) {
  return {
    fetchLibraries: (...args) => {
      dispatch(fetchLibraries(...args));
    },
    addLibrary: (...args) => {
      dispatch(addLibrary(...args));
    }
  };
}

export default connect(mapState, mapDispatch)(LibrarySettings);
