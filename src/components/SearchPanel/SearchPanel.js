import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import SearchResult from 'components/SearchResult';
import SearchOverlay from 'components/SearchOverlay';
import Icon from 'components/Icon';
import getClassName from 'helpers/getClassName';
import DataElementWrapper from 'components/DataElementWrapper';

import './SearchPanel.scss';
import useSearch from "hooks/useSearch";

const propTypes = {
  isOpen: PropTypes.bool,
  isMobile: PropTypes.bool,
  pageLabels: PropTypes.array,
  currentWidth: PropTypes.number,
  closeSearchPanel: PropTypes.func,
  setActiveResult: PropTypes.func,
  isInDesktopOnlyMode: PropTypes.bool,
  isProcessingSearchResults: PropTypes.bool
};

function noop() {}

function SearchPanel(props) {
  const {
    isOpen,
    currentWidth,
    pageLabels,
    closeSearchPanel = noop,
    setActiveResult = noop,
    isMobile = false,
    isInDesktopOnlyMode,
    isProcessingSearchResults
  } = props;

  const { t } = useTranslation();
  const { searchStatus, searchResults, activeSearchResultIndex } = useSearch();

  const onCloseButtonClick = React.useCallback(function onCloseButtonClick() {
    if (closeSearchPanel) {
      closeSearchPanel();
    }
  }, [closeSearchPanel]);

  const onClickResult = React.useCallback(function onClickResult(resultIndex, result) {
    setActiveResult(result);
    if (!isInDesktopOnlyMode && isMobile) {
      closeSearchPanel();
    }
  }, [setActiveResult, closeSearchPanel]);

  const className = getClassName('Panel SearchPanel', { isOpen });
  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };

  return (
    <DataElementWrapper
      className={className}
      dataElement="searchPanel"
      style={style}
    >
      {!isInDesktopOnlyMode && isMobile &&
      <div
        className="close-container"
      >
        <button
          className="close-icon-container"
          onClick={onCloseButtonClick}
        >
          <Icon
            glyph="ic_close_black_24px"
            className="close-icon"
          />
        </button>
      </div>}
      <SearchOverlay
        searchStatus={searchStatus}
        searchResults={searchResults}
        activeResultIndex={activeSearchResultIndex}
        isPanelOpen={isOpen}
      />
      <SearchResult
        t={t}
        searchStatus={searchStatus}
        searchResults={searchResults}
        activeResultIndex={activeSearchResultIndex}
        onClickResult={onClickResult}
        pageLabels={pageLabels}
        isProcessingSearchResults={isProcessingSearchResults}
      />
    </DataElementWrapper>
  );
}

SearchPanel.propTypes = propTypes;

export default SearchPanel;
