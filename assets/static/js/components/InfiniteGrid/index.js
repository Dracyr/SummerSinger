import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  AutoSizer,
  Grid,
  WindowScroller,
  InfiniteLoader
} from "react-virtualized";

const columnCount = 5;

export default class InfiniteGrid extends Component {
  static propTypes = {
    entryCount: PropTypes.number,
    loadMoreRows: PropTypes.func,
    isRowLoaded: PropTypes.func,
    renderItem: PropTypes.func.isRequired
  };

  static defaultProps = {
    entryCount: 0,
    isRowLoaded: () => true,
    loadMoreRows: () => {}
  };

  constructor(props) {
    super(props);
    this.requestedPages = new Set();

    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.scrollElement = document.getElementById("main-content");
  }

  loadMoreRows({ startIndex, stopIndex }) {
    if (this.props.loadMoreRows) {
      const pageSize = 50;

      const pages = [
        Math.floor(startIndex / pageSize) * pageSize,
        Math.floor(stopIndex / pageSize) * pageSize,
        Math.ceil(startIndex / pageSize) * pageSize,
        Math.ceil(stopIndex / pageSize) * pageSize
      ];
      pages.forEach(page => {
        if (
          !this.props.isRowLoaded(page) &&
          !this.requestedPages.has(page) &&
          !isNaN(page)
        ) {
          this.requestedPages.add(page);
          this.props.loadMoreRows(page, pageSize);
        }
      });
    }
  }

  render() {
    const { isRowLoaded, entryCount, renderItem } = this.props;
    return (
      <WindowScroller scrollElement={this.scrollElement}>
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
                    onSectionRendered={({
                      columnStartIndex,
                      columnStopIndex,
                      rowStartIndex,
                      rowStopIndex
                    }) =>
                      onRowsRendered({
                        startIndex:
                          rowStartIndex * columnCount + columnStartIndex,
                        stopIndex: rowStopIndex * columnCount + columnStopIndex
                      })
                    }
                    rowCount={Math.ceil(entryCount / columnCount)}
                    cellRenderer={renderItem}
                    columnCount={columnCount}
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
