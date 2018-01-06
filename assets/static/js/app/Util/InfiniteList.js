import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, List, WindowScroller, InfiniteLoader } from 'react-virtualized';

export default class InfiniteList extends PureComponent {
  static propTypes = {
    entryCount: PropTypes.number,
    loadMoreRows: PropTypes.func,
    isRowLoaded: PropTypes.func,
    rowHeight: PropTypes.number,
    renderItem: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.requestedPages = new Set();

    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.scrollElement = document.getElementById('main-content');
  }

  loadMoreRows({ startIndex, stopIndex }) {
    if (this.props.loadMoreRows) {
      const pageSize = 50;

      const pages = [
        Math.floor(startIndex / pageSize) * pageSize,
        Math.floor(stopIndex / pageSize) * pageSize,
        Math.ceil(startIndex / pageSize) * pageSize,
        Math.ceil(stopIndex / pageSize) * pageSize,
      ];
      pages.forEach((page) => {
        if (!this.props.isRowLoaded(page) && !this.requestedPages.has(page) && !isNaN(page)) {
          this.requestedPages.add(page);
          this.props.loadMoreRows(page, pageSize);
        }
      });
    }
  }

  render() {
    return (
      <InfiniteLoader
        isRowLoaded={this.props.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={this.props.entryCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller
            scrollElement={this.scrollElement}
          >
            {({ height, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    ref={registerChild}
                    autoHeight
                    height={height || 0}
                    width={width}
                    rowRenderer={this.props.renderItem}
                    rowCount={this.props.entryCount}
                    rowHeight={this.props.rowHeight}
                    onRowsRendered={onRowsRendered}
                    scrollTop={scrollTop}

                    {...this.props.additionalKeys}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    );
  }
}
