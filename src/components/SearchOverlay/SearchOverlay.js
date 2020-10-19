import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import Choice from '../Choice/Choice';
import './SearchOverlay.scss';

const propTypes = {
  isSearchOverlayDisabled: PropTypes.bool,
  searchValue: PropTypes.string,
  isCaseSensitive: PropTypes.bool,
  isWholeWord: PropTypes.bool,
  isWildcard: PropTypes.bool,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  activeResultIndex: PropTypes.number,
  setSearchValue: PropTypes.func.isRequired,
  setCaseSensitive: PropTypes.func.isRequired,
  setWholeWord: PropTypes.func.isRequired,
  setWildcard: PropTypes.func.isRequired,
  executeSearch: PropTypes.func.isRequired,
  selectNextResult: PropTypes.func,
  selectPreviousResult: PropTypes.func,
};

function SearchOverlay(props) {
  const { t } = useTranslation();
  const { isSearchOverlayDisabled, searchResults, activeResultIndex, selectNextResult, selectPreviousResult } = props;
  const { searchValue, setSearchValue, executeSearch } = props;
  const { isCaseSensitive, setCaseSensitive, isWholeWord, setWholeWord, isWildcard, setWildcard } = props;

  const searchTextInputRef = React.useRef();

  React.useEffect(() => {
    if (searchTextInputRef.current) {
      searchTextInputRef.current.focus();
    }
  }, []);

  const textInputOnChange = React.useCallback(function textInputOnChangeCallback(event) {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
  }, [setSearchValue]);

  const textInputOnKeyDown = React.useCallback(function textInputOnKeyDownCallback(event) {
    if (event.key === 'Enter') {
      executeSearch(searchValue, {
        caseSensitive: isCaseSensitive,
        wholeWord: isWholeWord,
        wildcard: isWildcard,
      });
    }
  }, [executeSearch, searchValue, isCaseSensitive, isWholeWord, isWildcard]);

  const searchButtonOnClick = React.useCallback(function onSearchButtonClickCallback() {
    executeSearch(searchValue, {
      caseSensitive: isCaseSensitive,
      wholeWord: isWholeWord,
      wildcard: isWildcard,
    });
  }, [executeSearch, searchValue, isCaseSensitive, isWholeWord, isWildcard]);

  const caseSensitiveSearchOptionOnChange = React.useCallback(function caseSensitiveSearchOptionOnChangeCallback(event) {
    const isChecked = event.target.checked;
    setCaseSensitive(isChecked);
  }, [searchValue, setCaseSensitive, isWholeWord, isWildcard]);

  const wholeWordSearchOptionOnChange = React.useCallback(function wholeWordSearchOptionOnChangeCallback(event) {
    const isChecked = event.target.checked;
    setWholeWord(isChecked);
  }, [searchValue, setWholeWord, isCaseSensitive, isWildcard]);

  const wildcardOptionOnChange = React.useCallback(function wildcardOptionOnChangeCallback(event) {
    const isChecked = event.target.checked;
    setWildcard(isChecked);
  }, [searchValue, setWildcard, isCaseSensitive, isWholeWord]);

  const nextButtonOnClick = React.useCallback(function nextButtonOnClickCallback() {
    if (selectNextResult) {
      selectNextResult(searchResults, activeResultIndex);
    }
  }, [selectNextResult, searchResults, activeResultIndex]);

  const previousButtonOnClick = React.useCallback(function previousButtonOnClickCallback() {
    if (selectPreviousResult) {
      selectPreviousResult(searchResults, activeResultIndex);
    }
  }, [selectPreviousResult, searchResults, activeResultIndex]);


  if (isSearchOverlayDisabled) {
    return null;
  }
  const numberOfResultsFound = searchResults ? searchResults.length : 0;
  return (
    <div className="SearchOverlay">
      <div className="input-container">
        <input
          ref={searchTextInputRef}
          type="text"
          autoComplete="off"
          onChange={textInputOnChange}
          onKeyDown={textInputOnKeyDown}
          value={searchValue}
          placeholder={t('message.searchDocumentPlaceholder')}
          aria-label={t('message.searchDocumentPlaceholder')}
          id="SearchPanel__input"
        />
        <button
          className="input-button"
          onClick={searchButtonOnClick}
          aria-label={t('message.searchDocumentPlaceholder')}
        >
          <Icon glyph="icon-header-search" />
        </button>
      </div>
      <div className="options">
        <Choice
          dataElement="caseSensitiveSearchOption"
          id="case-sensitive-option"
          checked={isCaseSensitive}
          onChange={caseSensitiveSearchOptionOnChange}
          label={t('option.searchPanel.caseSensitive')}
        />
        <Choice
          dataElement="wholeWordSearchOption"
          id="whole-word-option"
          checked={isWholeWord}
          onChange={wholeWordSearchOptionOnChange}
          label={t('option.searchPanel.wholeWordOnly')}
        />
        <Choice
          dataElement="wildCardSearchOption"
          id="wild-card-option"
          checked={isWildcard}
          onChange={wildcardOptionOnChange}
          label={t('option.searchPanel.wildcard')}
        />
      </div>
      <div className="divider" />
      <div className="footer">
        {<div>{numberOfResultsFound} {t('message.numResultsFound')}</div>}
        <div className="buttons">
          <button
            className="button"
            onClick={previousButtonOnClick}
            aria-label={t('action.prevResult')}
          >
            <Icon className="arrow" glyph="icon-chevron-left" />
          </button>
          <button
            className="button"
            onClick={nextButtonOnClick}
            aria-label={t('action.nextResult')}
          >
            <Icon className="arrow" glyph="icon-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
}

SearchOverlay.propTypes = propTypes;

export default SearchOverlay;

