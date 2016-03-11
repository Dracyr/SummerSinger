import ReactList from 'react-list';

export default class extends ReactList {
  componentDidUpdate() {
    this.updateFrame();

    const { from, size } = this.state;
    const { isRowLoaded } = this.props;

    const threshold = 5;
    if (this.props.localLength < this.props.length &&
          !isRowLoaded(from + size + threshold)) {
      this.props.loadMoreRows(from, size);
    }
  }
}
