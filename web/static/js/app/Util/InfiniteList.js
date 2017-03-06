import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';
import { getScrollParent } from '../Util/Util';

export default function proxyList(WrappedList) {
  return class InfiniteListProxy extends PureComponent {
    constructor() {
      super();
      this.requestedPages = new Set();
      this.isRowLoaded = this.isRowLoaded.bind(this);
      this.onScroll = _.throttle(this.onScroll.bind(this), 100, { leading: false, trailing: true });
      this.entryList = null;
    }

    componentDidMount() {
      getScrollParent(this).addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
      getScrollParent(this).removeEventListener('scroll', this.onScroll);
    }

    onScroll() {
      if (this.props.loadMoreRows) {
        const [start, end] = this.entryList.getVisibleRange();
        const pageSize = 50;

        const pages = [
          Math.floor(start / pageSize) * pageSize,
          Math.floor(end / pageSize) * pageSize,
          Math.ceil(start / pageSize) * pageSize,
          Math.ceil(end / pageSize) * pageSize,
        ];
        pages.forEach((page) => {
          if (!this.isRowLoaded(page) && !this.requestedPages.has(page) && !isNaN(page)) {
            this.requestedPages.add(page);
            this.props.loadMoreRows(page, 50);
          }
        });
      }
    }

    isRowLoaded(index) {
      return !!(this.props.entries && this.props.entries[index]);
    }

    proc(wrappedComponentInstance) {
      if (wrappedComponentInstance) {
        this.entryList = wrappedComponentInstance.getEntryList();
        this.wrappedComponentInstance = wrappedComponentInstance;
      }
    }

    render() {
      const props = Object.assign({}, this.props, { ref: this.proc.bind(this) });
      return <WrappedList {...props} />;
    }
  };
}
