import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  AutoSizer,
  List,
  WindowScroller,
  InfiniteLoader
} from "react-virtualized";

export default class InfiniteList extends PureComponent {
  static propTypes = {
    entryCount: PropTypes.number.isRequired,
    loadMoreRows: PropTypes.func,
    isRowLoaded: PropTypes.func.isRequired,
    rowHeight: PropTypes.number.isRequired,
    renderItem: PropTypes.func.isRequired,
    additionalKeys: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.requestedPages = new Set();
    this.scrollElement = document.getElementById("main-content");
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    if (this.props.loadMoreRows) {
      const pageSize = 50;

      [
        Math.floor(startIndex / pageSize) * pageSize,
        Math.floor(stopIndex / pageSize) * pageSize,
        Math.ceil(startIndex / pageSize) * pageSize,
        Math.ceil(stopIndex / pageSize) * pageSize
      ].forEach(page => {
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
  };

  render() {
    return (
      <InfiniteLoader
        isRowLoaded={this.props.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={this.props.entryCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller scrollElement={this.scrollElement}>
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
