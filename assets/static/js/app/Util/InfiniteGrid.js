import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, Grid, WindowScroller, InfiniteLoader } from 'react-virtualized';

export default class InfiniteGrid extends PureComponent {
  static propTypes = {
    entryCount: PropTypes.number,
    loadMoreRows: PropTypes.func,
    isRowLoaded: PropTypes.func,
    renderItem: PropTypes.func,
  };

  static defaultProps = {
    entryCount: 0,
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
    const { isRowLoaded, entryCount, renderItem } = this.props;
    const scrollElement = document.getElementById("main-content");

    return (
      <WindowScroller scrollElement={scrollElement}>
        {({ height, scrollTop }) => (
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={entryCount}
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer>
                {({ width }) => (
                  <Grid
                    autoHeight
                    ref={registerChild}
                    scrollTop={scrollTop}
                    onSectionRendered={({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) => {
                      return onRowsRendered({
                        startIndex: (rowStartIndex * 5) + columnStartIndex,
                        stopIndex: (rowStopIndex * 5) + columnStopIndex,
                      });
                    }}
                    rowCount={Math.ceil(entryCount / 5)}
                    cellRenderer={renderItem}
                    columnCount={5}
                    columnWidth={175}
                    rowHeight={215}
                    height={height || 0}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        )}
      </WindowScroller>
    );
  }
}
