import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchLibraries, addLibrary } from '../actions';
import NewLibraryModal from './NewLibraryModal';

class LibrarySettings extends PureComponent {
  static propTypes = {
    fetchLibraries: PropTypes.func.isRequired,
    libraries: PropTypes.array.isRequired,
  };

  constructor() {
    super();
    this.state = {
      addLibraryOpen: false,
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
        <div className="display-table">
          <div className="thead">
            <div className="tr">
              <div className="td">Title</div>
              <div className="td">Path</div>
              <div className="td" />
            </div>
          </div>
          <div className="tbody">
            {this.props.libraries.map(library => (
              <div className="tr" key={library.id}>
                <div className="td"><b>{library.title}</b></div>
                <div className="td">{library.path}</div>
                <div className="td">Rescan</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => this.setState({ addLibraryOpen: true })}>
          Add Library
        </button>

        {this.state.addLibraryOpen &&
          <NewLibraryModal submit={this.addLibrary} />
        }
      </div>
    );
  }
}

function mapState(state) {
  return {
    libraries: state.settings.libraryIds.map(libraryId => state.settings.libraryById[libraryId]),
  };
}

function mapDispatch(dispatch) {
  return {
    fetchLibraries: (...args) => { dispatch(fetchLibraries(...args)); },
    addLibrary: (...args) => { dispatch(addLibrary(...args)); },
  };
}

export default connect(mapState, mapDispatch)(LibrarySettings);

