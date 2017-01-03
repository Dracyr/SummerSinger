import ReactList from 'react-list';

export default class extends ReactList {
  componentDidUpdate() {
    this.updateFrame();

    const { from, size } = this.state;
    const { isRowLoaded } = this.props;
    const threshold = 5;

    // Above
    if (from - threshold > 0 && !isRowLoaded(from - threshold)) {
      this.props.loadMoreRows(from - size + 1, size);
    }

    // Below
    if (this.props.localLength < this.props.length &&
        !isRowLoaded(from + size + threshold)) {
      let beginLoadAt = from + size + threshold;
      for (let i = beginLoadAt; i > from; i--) {
        if (isRowLoaded(beginLoadAt)) {
          break;
        }
        beginLoadAt = i;
      }
      this.props.loadMoreRows(beginLoadAt, size);
    }
  }
}
