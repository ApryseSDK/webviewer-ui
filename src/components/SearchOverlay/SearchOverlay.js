import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Icon from 'components/Icon';
import Choice from '../Choice/Choice';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

import { getOverrideSearchExecution } from "helpers/search";
import searchTextFullFactory from '../../apis/searchTextFull';

// Create searchTextFull without dispatch as redux is handled by the component
const searchTextFull = searchTextFullFactory();

import './SearchOverlay.scss';

const propTypes = {
  isSearchOverlayDisabled: PropTypes.bool,
  isWildCardSearchDisabled: PropTypes.bool,
  searchValue: PropTypes.string,
  isCaseSensitive: PropTypes.bool,
  isWholeWord: PropTypes.bool,
  isSearchUp: PropTypes.bool,
  isAmbientString: PropTypes.bool,
  isWildcard: PropTypes.bool,
  isRegex: PropTypes.bool,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  activeResultIndex: PropTypes.number,
  setSearchValue: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  setCaseSensitive: PropTypes.func.isRequired,
  setWholeWord: PropTypes.func.isRequired,
  setWildcard: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

function SearchOverlay(props) {
  const { isSearchOverlayDisabled, t, searchResults, activeResultIndex } = props;
  const { searchValue, setSearchValue } = props;
  const { isCaseSensitive, setCaseSensitive, isWholeWord, setWholeWord, isWildcard, setWildcard } = props;

  const searchTextInputRef = React.useRef();

  React.useEffect(() => {
    searchTextInputRef.current.focus();
  }, []);

  const executeSearch = React.useCallback(function executeSearchCallback(options = {}) {
    const searchOptions = {
      caseSensitive: isCaseSensitive,
      wholeWord: isWholeWord,
      wildcard: isWildcard,
      regex: false,
      ...options,
    };
    if (searchValue) {
      if (searchTextInputRef.current) {
        searchTextInputRef.current.blur();
      }
      // user can override search execution with instance.overrideSearchExecution()
      // Here we check if user has done that and call that rather than default search execution
      const overrideSearchExecution = getOverrideSearchExecution();
      if (overrideSearchExecution) {
        overrideSearchExecution(searchValue, searchOptions);
      } else {
        searchTextFull(searchValue, searchOptions);
      }
    }
  }, [searchValue, isCaseSensitive, isWholeWord, isWildcard]);

  const textInputOnChange = React.useCallback(function textInputOnChangeCallback(event) {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
  }, [setSearchValue]);

  const textInputOnKeyDown = React.useCallback(function textInputOnKeyDownCallback(event) {
    if (event.which === 13) { // Enter
      executeSearch();
    }
  }, [executeSearch]);

  const searchButtonOnClick = React.useCallback(function onSearchButtonClickCallback() {
    executeSearch();
  }, [executeSearch]);

  const caseSensitiveSearchOptionOnChange = React.useCallback(function caseSensitiveSearchOptionOnChangeCallback(event) {
    const isChecked = event.target.checked;
    setCaseSensitive(isChecked);
  }, [setCaseSensitive]);

  const wholeWordSearchOptionOnChange = React.useCallback(function wholeWordSearchOptionOnChangeCallback(event) {
    const isChecked = event.target.checked;
    setWholeWord(isChecked);
  }, [setWholeWord]);

  const wildcardOptionOnChange = React.useCallback(function wildcardOptionOnChangeCallback(event) {
    const isChecked = event.target.checked;
    setWildcard(isChecked);
  }, [setWildcard]);

  const nextButtonOnClick = React.useCallback(function nextButtonOnClickCallback(event) {
    if (searchResults.length > 0) {
      const nextResultIndex = activeResultIndex === searchResults.length - 1 ? 0 : activeResultIndex + 1;
      core.setActiveSearchResult(searchResults[nextResultIndex]);
    }
  }, [searchResults, activeResultIndex]);

  const previousButtonOnClick = React.useCallback(function previousButtonOnClickCallback(event) {
    //event.preventDefault();
    if (searchResults.length > 0) {
      const prevResultIndex = activeResultIndex <= 0 ? searchResults.length - 1 : activeResultIndex - 1;
      core.setActiveSearchResult(searchResults[prevResultIndex]);
    }
  }, [searchResults, activeResultIndex]);


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

const mapStateToProps = state => ({
  isSearchOverlayDisabled: selectors.isElementDisabled(state, 'searchOverlay'),
  searchValue: selectors.getSearchValue(state),
  isCaseSensitive: selectors.isCaseSensitive(state),
  isWholeWord: selectors.isWholeWord(state),
  isAmbientString: selectors.isAmbientString(state),
  isSearchUp: selectors.isSearchUp(state),
  isWildcard: selectors.isWildcard(state),
  isRegex: selectors.isRegex(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  setSearchValue: actions.setSearchValue,
  resetSearch: actions.resetSearch,
  setCaseSensitive: actions.setCaseSensitive,
  setWholeWord: actions.setWholeWord,
  setWildcard: actions.setWildcard,
};

function SearchOverlayRedux(props) {
  return (<SearchOverlay {...props} />);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchOverlayRedux);
