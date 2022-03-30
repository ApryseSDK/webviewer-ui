import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import RedactionSearchResultGroup from 'components/RedactionSearchResultGroup';
import Spinner from 'components/Spinner';
import './RedactionSearchResults.scss'
import classNames from 'classnames';
import { Virtuoso } from 'react-virtuoso';
import SearchStatus from 'constants/searchStatus';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';

function RedactionSearchResults(props) {
  const {
    redactionSearchResults,
    searchStatus,
    onCancelSearch,
    isProcessingRedactionResults,
    markSelectedResultsForRedaction,
    redactSelectedResults,
  } = props;

  const { t } = useTranslation();
  const [redactionSearchResultPageMap, setRedactionSearchResultPageMap] = useState({});
  const [selectedSearchResultIndexesMap, setSelectedSearchResultIndexesMap] = useState({});
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  // The following prop is needed only for the tests to actually render a list of results
  // it only is ever injected in the tests
  const { isTestMode } = useContext(RedactionPanelContext);


  useEffect(() => {
    const redactionSearchResultPageMap = {};
    redactionSearchResults.forEach((result, index) => {
      const pageNumber = result.pageNum;
      result.index = index;
      if (redactionSearchResultPageMap[pageNumber] === undefined) {
        redactionSearchResultPageMap[pageNumber] = [result];
      } else {
        redactionSearchResultPageMap[pageNumber] = [...redactionSearchResultPageMap[pageNumber], result];
      }
    });

    setRedactionSearchResultPageMap(redactionSearchResultPageMap);

    const selectedIndexesMap = {};
    redactionSearchResults.forEach((value, index) => selectedIndexesMap[index] = false);
    setSelectedSearchResultIndexesMap(selectedIndexesMap);
  }, [redactionSearchResults]);


  useEffect(() => {
    const selectedIndexes = redactionSearchResults.filter((redactionSearchResult, index) => {
      return selectedSearchResultIndexesMap[index];
    });

    setSelectedIndexes(selectedIndexes);

  }, [selectedSearchResultIndexesMap])


  const renderSearchResults = () => {
    const resultGroupPageNumbers = Object.keys(redactionSearchResultPageMap);
    if (resultGroupPageNumbers.length > 0) {
      // Needed for the tests to actually render a list of results
      const testModeProps = isTestMode ? { initialItemCount: resultGroupPageNumbers.length } : {}
      return (
        <Virtuoso
          data={resultGroupPageNumbers}
          itemContent={(index, pageNumber) => {
            return (
              <RedactionSearchResultGroup
                key={index}
                pageNumber={pageNumber}
                searchResults={redactionSearchResultPageMap[pageNumber]}
                selectedSearchResultIndexes={selectedSearchResultIndexesMap}
                setSelectedSearchResultIndexes={setSelectedSearchResultIndexesMap}
              />)
          }}
          {...testModeProps}
        />);
    }
  };

  const renderStartSearch = () => (
    <div aria-label={t('redactionPanel.search.start')}>
      {t('redactionPanel.search.start')}
    </div>
  );

  const noResults = (
    <div aria-label={t('message.noResults')}>
      {t('message.noResults')}
    </div>
  );

  const renderSearchInProgress = () => (
    <div >
      <Spinner height="25px" width="25px" />
    </div>
  );

  const onCancelHandler = () => {
    setRedactionSearchResultPageMap({});
    onCancelSearch();
  };

  const selectAllResults = () => {
    const searchResultIndexMap = {};
    redactionSearchResults.forEach((value, index) => searchResultIndexMap[index] = true);
    setSelectedSearchResultIndexesMap(searchResultIndexMap);
  };

  const unselectAllResults = () => {
    const searchResultIndexMap = {};
    redactionSearchResults.forEach((value, index) => searchResultIndexMap[index] = false);
    setSelectedSearchResultIndexesMap(searchResultIndexMap);
  };

  const onMarkAllForRedaction = () => {
    markSelectedResultsForRedaction(selectedIndexes);
    onCancelSearch();
  };

  const onRedactSelectedResults = () => {
    redactSelectedResults(selectedIndexes);
  };

  const isEmptyList = redactionSearchResults.length === 0;

  const resultsContainerClass = classNames('redaction-search-results-container', { emptyList: isEmptyList });
  const redactAllButtonClass = classNames('redact-all-selected', { disabled: selectedIndexes.length === 0 });
  const markAllForRedactionButtonClass = classNames('mark-all-selected', { disabled: selectedIndexes.length === 0 });
  const shouldShowResultsCounterOptions = (searchStatus === SearchStatus['SEARCH_DONE'] && !isProcessingRedactionResults) || searchStatus === SearchStatus['SEARCH_NOT_INITIATED'];

  return (
    <>
      <div className="redaction-search-counter-controls">
        {searchStatus === SearchStatus['SEARCH_IN_PROGRESS'] && (
          <div style={{ flexGrow: 1 }}>
            <Spinner height="18px" width="18px" />
          </div>)}
        {shouldShowResultsCounterOptions && (
          <>
            <div className="redaction-search-results-counter">
              <span>{t('redactionPanel.searchResults')}</span> ({redactionSearchResults.length})
            </div>
            <button
              onClick={selectAllResults}
              disabled={isEmptyList}
              aria-label={t('action.selectAll')}>
              {t('action.selectAll')}
            </button>
            <button
              disabled={isEmptyList}
              onClick={unselectAllResults}
              aria-label={t('action.unselect')}>
              {t('action.unselect')}
            </button>
          </>)}
      </div>
      <div className={resultsContainerClass} role="list">
        {searchStatus === SearchStatus['SEARCH_NOT_INITIATED'] && renderStartSearch()}
        {(searchStatus === SearchStatus['SEARCH_IN_PROGRESS'] && isEmptyList && isProcessingRedactionResults) && renderSearchInProgress()}
        {searchStatus === SearchStatus['SEARCH_DONE'] && isEmptyList && !isProcessingRedactionResults && noResults}
        {(searchStatus === SearchStatus['SEARCH_IN_PROGRESS'] || searchStatus === SearchStatus['SEARCH_DONE']) && renderSearchResults()}
      </div>
      <div className="redaction-search-panel-controls" >
        <button
          onClick={onCancelHandler}
          aria-label={t('action.cancel')}
          className='cancel'
        >
          {t('action.cancel')}
        </button>
        <button
          disabled={selectedIndexes.length === 0}
          aria-label={t('annotation.redact')}
          className={redactAllButtonClass}
          onClick={onRedactSelectedResults}
        >
          {t('annotation.redact')}
        </button>
        <button
          disabled={selectedIndexes.length === 0}
          aria-label={t('action.addMark')}
          className={markAllForRedactionButtonClass}
          onClick={onMarkAllForRedaction}
        >
          {t('action.addMark')}
        </button>
      </div >
    </>
  );
};

export default RedactionSearchResults;