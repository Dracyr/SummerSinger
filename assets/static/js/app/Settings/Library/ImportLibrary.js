import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import { cd } from '../actions';

class Dir extends PureComponent {
  constructor() {
    super();
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler() {
    this.props.onClickHandler(this.props.path);
  }

  render() {
    return (
      <div className={`tr ${this.props.selected ? 'selected' : ''}`} onClick={this.onClickHandler}>
        <div className="td">
          {this.props.title}
        </div>
      </div>
    );
  }
}

class ImportLibrary extends PureComponent {
  constructor() {
    super();
    this.cd = this.cd.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.state = {
      selected: null,
    };
  }

  componentDidMount() {
    this.props.cd('/');
  }

  onClickHandler(path) {
    if (this.state.selected === path) {
      this.cd(path);
    } else {
      this.setState({ selected: path });
    }
  }

  cd(path) {
    const { dir, cd } = this.props;
    if (path === '..') {
      cd(dir.path.substring(0, dir.path.lastIndexOf('/')) || '/');
    } else {
      cd(path);
    }
    this.setState({ selected: null });
  }

  submitHandler() {
    if (this.state.selected && this.state.selected !== '..') {
      this.props.submit(this.state.selected);
    }
  }

  render() {
    const dir = this.props.dir;

    const up = dir.path !== '/' ? (
      <div className="tr" key=".." onClick={() => this.onClickHandler('..')}>
        <div className="td">..</div>
      </div>
    ) : '';

    let selected = 'None selected';
    if (this.state.selected && this.state.selected !== '..') {
      selected = `Selected: ${this.state.selected}`;
    }

    return (
      <div>
        <h4>{dir.path}</h4>
        <div className="display-table dir-table">
          {up}
          {dir.children.map(f =>
            <Dir
              key={f}
              onClickHandler={this.onClickHandler}
              path={dir.path === '/' ? `/${f}` : `${dir.path}/${f}`}
              selected={(dir.path === '/' ? `/${f}` : `${dir.path}/${f}`) === this.state.selected}
              title={f}
            />,
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {selected}
          <button onClick={this.submitHandler}>Select</button>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    dir: state.settings.import_library_dir,
  };
}

function mapDispatch(dispatch) {
  return {
    cd: (...args) => dispatch(cd(...args)),
  };
}

export default connect(mapState, mapDispatch)(ImportLibrary);
