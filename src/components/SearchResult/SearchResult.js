import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { withContentRect } from 'react-measure';
import PropTypes from 'prop-types';
import './SearchResult.scss';
import VirtualizedList from 'react-virtualized/dist/commonjs/List';
import CellMeasurer, { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import ListSeparator from 'components/ListSeparator';
import classNames from 'classnames';
import { isSpreadsheetEditorMode } from 'src/helpers/officeEditor';

const SearchResultListSeparatorPropTypes = {
  currentResultIndex: PropTypes.number.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
  pageLabels: PropTypes.arrayOf(PropTypes.any).isRequired,
  isProcessingSearchResults: PropTypes.bool
};

function SearchResultListSeparator(props) {
  const { currentResultIndex, searchResults, t, pageLabels } = props;

  const previousIndex = currentResultIndex === 0 ? currentResultIndex : currentResultIndex - 1;
  const currentListItem = searchResults[currentResultIndex];
  const previousListItem = searchResults[previousIndex];

  const isFirstListItem = previousListItem === currentListItem;
  const isInDifferentPage = previousListItem.pageNum !== currentListItem.pageNum;
  const isInDifferentSheet = previousListItem.sheetOrder !== currentListItem.sheetOrder;

  if (isFirstListItem || isInDifferentPage || isInDifferentSheet) {
    let listSeparatorText;
    if (isSpreadsheetEditorMode()) {
      listSeparatorText = pageLabels[currentListItem.sheetOrder];
    } else {
      listSeparatorText = `${t('option.shared.page')} ${pageLabels[currentListItem.pageNum - 1]}`;
    }
    return (
      <div role="cell">
        <ListSeparator>{listSeparatorText}</ListSeparator>
      </div>
    );
  }
  return null;
}

SearchResultListSeparator.propTypes = SearchResultListSeparatorPropTypes;

const SearchResultListItemPropTypes = {
  result: PropTypes.object.isRequired,
  currentResultIndex: PropTypes.number.isRequired,
  activeResultIndex: PropTypes.number.isRequired,
  onSearchResultClick: PropTypes.func,
  activeDocumentViewerKey: PropTypes.number,
  title: PropTypes.string
};

function SearchResultListItem(props) {
  const [customizableUI] = useSelector((state) => [state.featureFlags.customizableUI]);
  const { result, currentResultIndex, activeResultIndex, onSearchResultClick, activeDocumentViewerKey, title } = props;
  const { ambientStr, resultStrStart, resultStrEnd, resultStr } = result;
  const textBeforeSearchValue = ambientStr.slice(0, resultStrStart);
  const searchValue = ambientStr === '' ? resultStr : ambientStr.slice(resultStrStart, resultStrEnd);
  const textAfterSearchValue = ambientStr.slice(resultStrEnd);
  return (
    <button
      role="cell"
      className={classNames({
        'SearchResult': true,
        'selected': currentResultIndex === activeResultIndex,
        'modular-ui': customizableUI
      })}
      onClick={() => {
        if (onSearchResultClick) {
          onSearchResultClick(currentResultIndex, result, activeDocumentViewerKey);
        }
      }}
      aria-current={currentResultIndex === activeResultIndex}
    >
      {title && <div className='search-title'>{title}</div>}
      {textBeforeSearchValue}
      <span className='search-value'>
        {searchValue}
      </span>
      {textAfterSearchValue}
    </button>
  );
}
SearchResultListItem.propTypes = SearchResultListItemPropTypes;

const SearchResultPropTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  activeResultIndex: PropTypes.number,
  searchStatus: PropTypes.oneOf(['SEARCH_NOT_INITIATED', 'SEARCH_IN_PROGRESS', 'SEARCH_DONE']),
  searchResults: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func.isRequired,
  onClickResult: PropTypes.func,
  pageLabels: PropTypes.arrayOf(PropTypes.any),
  activeDocumentViewerKey: PropTypes.number
};

function SearchResult(props) {
  const { height, searchStatus, searchResults, activeResultIndex, t, onClickResult, pageLabels, isProcessingSearchResults, isSearchInProgress, activeDocumentViewerKey } = props;
  const cellMeasureCache = useMemo(() => {
    return new CellMeasurerCache({ defaultHeight: 50, fixedWidth: true });
  }, []);
  const listRef = useRef(null);
  const [listSize, setListSize] = useState(0);

  if (searchResults.length === 0) {
    // clear measure cache, when doing a new search
    cellMeasureCache.clearAll();
  }

  if (searchResults.length && searchResults.length !== listSize) {
    // If the search list is mutated in the backend, we
    // need to clear cache and recalculate heights
    setListSize(searchResults.length);
    cellMeasureCache.clearAll();
  }

  const rowRenderer = useCallback(function rowRendererCallback(rendererOptions) {
    const { index, key, parent, style } = rendererOptions;
    const result = searchResults[index];
    return (
      <CellMeasurer
        cache={cellMeasureCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ registerChild }) => (
          <div role="row" ref={registerChild} style={style}>
            <SearchResultListSeparator
              currentResultIndex={index}
              searchResults={searchResults}
              pageLabels={pageLabels}
              t={t}
            />
            <SearchResultListItem
              title={isSpreadsheetEditorMode ? result.cell : undefined}
              result={result}
              currentResultIndex={index}
              activeResultIndex={activeResultIndex}
              onSearchResultClick={onClickResult}
              activeDocumentViewerKey={activeDocumentViewerKey}
            />
          </div>
        )}
      </CellMeasurer>
    );
  }, [cellMeasureCache, searchResults, activeResultIndex, t, pageLabels]);

  useEffect(() => {
    if (listRef) {
      listRef.current?.scrollToRow(activeResultIndex);
    }
  }, [activeResultIndex]);

  if (height == null) { // eslint-disable-line eqeqeq
    // VirtualizedList requires width and height of the component which is calculated by withContentRect HOC.
    // On first render when HOC haven't yet set these values, both are undefined, thus having this check here
    // and skip rendering if values are missing
    return null;
  }

  if (searchStatus === 'SEARCH_DONE'
    && searchResults.length === 0
    && !isProcessingSearchResults) {
    if (isSearchInProgress) {
      return null;
    }
    return (
      <div className="info"><p className="no-margin">{t('message.noResults')}</p></div>
    );
  }

  return (
    <VirtualizedList
      width={200}
      height={height}
      tabIndex={-1}
      overscanRowCount={10}
      rowCount={searchResults.length}
      deferredMeasurementCache={cellMeasureCache}
      rowHeight={cellMeasureCache.rowHeight}
      rowRenderer={rowRenderer}
      ref={listRef}
      scrollToIndex={activeResultIndex - 1}
    />
  );
}
SearchResult.propTypes = SearchResultPropTypes;

function SearchResultWithContentRectHOC(props) {
  const { measureRef, contentRect, ...rest } = props;
  const { height } = contentRect.bounds;
  return (
    <div className={classNames('results', {
      'spreadsheet-results': isSpreadsheetEditorMode()
    })} ref={measureRef}>
      <SearchResult height={height} {...rest} />
    </div>
  );
}
SearchResultWithContentRectHOC.propTypes = {
  contentRect: PropTypes.object,
  measureRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};

const SearchResultWithContentRectHOCAndBounds = withContentRect('bounds')(SearchResultWithContentRectHOC);

const SearchResultsContainer = (props) => {
  return (<SearchResultWithContentRectHOCAndBounds {...props} />);
};
export { SearchResult };
export default SearchResultsContainer;
