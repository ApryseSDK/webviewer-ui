import React from 'react';
import PropTypes from 'prop-types';
import core from 'core';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

import Icon from 'components/Icon';
import Choice from '../Choice/Choice';
import Spinner from '../Spinner';
import './SearchOverlay.scss';

const propTypes = {
  isPanelOpen: PropTypes.bool,
  isSearchOverlayDisabled: PropTypes.bool,
  searchValue: PropTypes.string,
  searchStatus: PropTypes.oneOf(['SEARCH_NOT_INITIATED', 'SEARCH_IN_PROGRESS', 'SEARCH_DONE']),
  isCaseSensitive: PropTypes.bool,
  isWholeWord: PropTypes.bool,
  isWildcard: PropTypes.bool,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  activeResultIndex: PropTypes.number,
  setSearchValue: PropTypes.func.isRequired,
  setCaseSensitive: PropTypes.func.isRequired,
  setSearchStatus: PropTypes.func.isRequired,
  setWholeWord: PropTypes.func.isRequired,
  setWildcard: PropTypes.func.isRequired,
  executeSearch: PropTypes.func.isRequired,
  selectNextResult: PropTypes.func,
  selectPreviousResult: PropTypes.func,
  isProcessingSearchResults: PropTypes.bool
};

function SearchOverlay(props) {
  const { t } = useTranslation();
  const { isSearchOverlayDisabled, searchResults, activeResultIndex, selectNextResult, selectPreviousResult, isProcessingSearchResults } = props;
  const { searchValue, setSearchValue, executeSearch } = props;
  const { isCaseSensitive, setCaseSensitive, isWholeWord, setWholeWord, isWildcard, setWildcard, setSearchStatus } = props;
  const { searchStatus, isPanelOpen } = props;

  const searchTextInputRef = React.useRef();
  const waitTime = 300;   // Wait time in milliseconds 

  React.useEffect(() => {
    if (searchTextInputRef.current && isPanelOpen) {
      searchTextInputRef.current.focus();
    }
  }, [isPanelOpen]);

  React.useEffect(() => {
    if(searchValue && searchValue.length > 0) {
      executeSearch(searchValue, {
        caseSensitive: isCaseSensitive,
        wholeWord: isWholeWord,
        wildcard: isWildcard,
      });
    } else {
      clearSearchResult();
    }
  }, [isCaseSensitive, isWholeWord, isWildcard]);

  const debouncedSearch = React.useCallback(
    debounce((searchValue) => {
      if(searchValue && searchValue.length > 0) {
        executeSearch(searchValue, {
          caseSensitive: isCaseSensitive,
          wholeWord: isWholeWord,
          wildcard: isWildcard,
        });
      } else {
        clearSearchResult();
      }
    }, waitTime),
    []
  );

  const textInputOnChange = (event) => {
    setSearchValue(event.target.value);
    debouncedSearch(event.target.value);
  }

  function clearSearchResult() {
    core.clearSearchResults();
    setSearchValue('');
    setSearchStatus('SEARCH_NOT_INITIATED');
  }

  const caseSensitiveSearchOptionOnChange = React.useCallback(
    function caseSensitiveSearchOptionOnChangeCallback(event) {
      const isChecked = event.target.checked;
      setCaseSensitive(isChecked);
    }, [],
  );

  const wholeWordSearchOptionOnChange = React.useCallback(
    function wholeWordSearchOptionOnChangeCallback(event) {
      const isChecked = event.target.checked;
      setWholeWord(isChecked);
    }, [],
  );

  const wildcardOptionOnChange = React.useCallback(
    function wildcardOptionOnChangeCallback(event) {
      const isChecked = event.target.checked;
      setWildcard(isChecked);
    }, [],
  );

  const nextButtonOnClick = React.useCallback(
    function nextButtonOnClickCallback() {
      if (selectNextResult) {
        selectNextResult(searchResults, activeResultIndex);
      }
    },
    [selectNextResult, searchResults, activeResultIndex],
  );

  const previousButtonOnClick = React.useCallback(
    function previousButtonOnClickCallback() {
      if (selectPreviousResult) {
        selectPreviousResult(searchResults, activeResultIndex);
      }
    },
    [selectPreviousResult, searchResults, activeResultIndex],
  );

  if (isSearchOverlayDisabled) {
    return null;
  }
  const numberOfResultsFound = searchResults ? searchResults.length : 0;

  const showSpinner = (searchStatus === 'SEARCH_DONE' && !isProcessingSearchResults)? (
    <div>
      {numberOfResultsFound} {t('message.numResultsFound')}
    </div>
  ) : (
    <Spinner />
  );

  return (
    <div className="SearchOverlay">
      <div className="input-container">
        <input
          ref={searchTextInputRef}
          type="text"
          autoComplete="off"
          onChange={textInputOnChange}
          value={searchValue}
          placeholder={t('message.searchDocumentPlaceholder')}
          aria-label={t('message.searchDocumentPlaceholder')}
          id="SearchPanel__input"
          tabIndex={isPanelOpen ? 0 : -1}
        />
        {(searchValue !== undefined) && searchValue.length > 0 && (
            <button
              className="clearSearch-button"
              onClick={clearSearchResult}
              aria-label={t('message.searchDocumentPlaceholder')}
            >
              <Icon glyph="icon-header-clear-search" />
            </button>
          )
        }
      </div>
      <div className="options">
        <Choice
          dataElement="caseSensitiveSearchOption"
          id="case-sensitive-option"
          checked={isCaseSensitive}
          onChange={caseSensitiveSearchOptionOnChange}
          label={t('option.searchPanel.caseSensitive')}
          tabIndex={isPanelOpen ? 0 : -1}
        />
        <Choice
          dataElement="wholeWordSearchOption"
          id="whole-word-option"
          checked={isWholeWord}
          onChange={wholeWordSearchOptionOnChange}
          label={t('option.searchPanel.wholeWordOnly')}
          tabIndex={isPanelOpen ? 0 : -1}
        />
        <Choice
          dataElement="wildCardSearchOption"
          id="wild-card-option"
          checked={isWildcard}
          onChange={wildcardOptionOnChange}
          label={t('option.searchPanel.wildcard')}
          tabIndex={isPanelOpen ? 0 : -1}
        />
      </div>
      <div className="divider" />
      <div className="footer">
        {searchStatus === 'SEARCH_NOT_INITIATED' || '' ? null : showSpinner}
        {numberOfResultsFound > 0 && (
          <div className="buttons">
            <button className="button" onClick={previousButtonOnClick} aria-label={t('action.prevResult')}>
              <Icon className="arrow" glyph="icon-chevron-left" />
            </button>
            <button className="button" onClick={nextButtonOnClick} aria-label={t('action.nextResult')}>
              <Icon className="arrow" glyph="icon-chevron-right" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

SearchOverlay.propTypes = propTypes;

export default SearchOverlay;
