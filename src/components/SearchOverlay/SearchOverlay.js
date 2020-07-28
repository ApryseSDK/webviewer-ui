import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Icon from 'components/Icon';
import Choice from '../Choice/Choice';

import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';
import debounce from 'lodash/debounce';

import './SearchOverlay.scss';

class SearchOverlay extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isSearchPanelOpen: PropTypes.bool,
    isSearchPanelDisabled: PropTypes.bool,
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
    isProgrammaticSearch: PropTypes.bool,
    isProgrammaticSearchFull: PropTypes.bool,
    searchListeners: PropTypes.arrayOf(PropTypes.func),
    closeElements: PropTypes.func.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    setCaseSensitive: PropTypes.func.isRequired,
    setWholeWord: PropTypes.func.isRequired,
    setWildcard: PropTypes.func.isRequired,
    setIsProgrammaticSearch: PropTypes.func.isRequired,
    setIsProgrammaticSearchFull: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    setSearchError: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.searchTextInput = React.createRef();
    this.wholeWordInput = React.createRef();
    this.caseSensitiveInput = React.createRef();
    this.wildcardInput = React.createRef();
    this.executeDebouncedFullSearch = debounce(this.executeFullSearch, 300);
    this.state = {
      noResultSingleSearch: false,
    };
  }

  componentDidMount() {
    this.searchTextInput.current.focus();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isProgrammaticSearchFull) {
      this.caseSensitiveInput.current.checked = this.props.isCaseSensitive;
      this.wholeWordInput.current.checked = this.props.isWholeWord;
      if (this.wildcardInput.current) {
        this.wildcardInput.current.checked = this.props.isWildcard;
      }

      this.clearSearchResults();
      this.executeFullSearch();
      this.props.setIsProgrammaticSearchFull(false);
    }

    const searchOverlayOpened = !prevProps.isOpen && this.props.isOpen;
    if (searchOverlayOpened) {
      this.props.closeElements([
        'toolsOverlay',
        'viewControlsOverlay',
        'menuOverlay',
        'toolStylePopup',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
      ]);
      this.searchTextInput.current.focus();
      core.setToolMode(defaultTool);
    }

    const searchOverlayClosed = prevProps.isOpen && !this.props.isOpen;
    if (searchOverlayClosed) {
      this.props.closeElements(['searchPanel']);
      this.clearSearchResults();
    }
  }

  handleSearchError = error => {
    const { setSearchError } = this.props;
    if (error && error.message) {
      setSearchError(error.message);
    }
  }

  clearSearchResults = () => {
    core.clearSearchResults();
    this.props.resetSearch();
  };

  executeFullSearch = () => {
    const handleSearchResult = result => {
      const { activeResultIndex } = this.props;
      const foundResult = result.resultCode === window.CoreControls.Search.ResultCode.FOUND;
      const isSearchDone = result.resultCode === window.CoreControls.Search.ResultCode.DONE;

      if (foundResult) {
        core.displayAdditionalSearchResult(result);
        if (activeResultIndex < 0) { // -1 if no active results are set
          core.setActiveSearchResult(result);
        }
      }
      if (isSearchDone) {
        this.runSearchListeners();
      }
    };

    const { searchValue } = this.props;
    const isFullSearch = true;
    const searchMode = this.getSearchMode(isFullSearch);
    const options = {
      'fullSearch': isFullSearch,
      'onResult': handleSearchResult,
      'onPageEnd': handleSearchResult,
      'onDocumentEnd': handleSearchResult,
      'onError': this.handleSearchError.bind(this),
    };

    core.textSearchInit(searchValue, searchMode, options);
  }

  getSearchMode = (isFull = false) => {
    const { isCaseSensitive, isWholeWord, isWildcard, isRegex, isSearchUp, isAmbientString, } = this.props;
    const {
      CASE_SENSITIVE,
      WHOLE_WORLD,
      WILD_CARD,
      REGEX,
      PAGE_STOP,
      HIGHLIGHT,
      SEARCH_UP,
      AMBIENT_STRING,
    } = core.getSearchMode();
    let searchMode = PAGE_STOP | HIGHLIGHT;

    if (isCaseSensitive) {
      searchMode |= CASE_SENSITIVE;
    }
    if (isWholeWord) {
      searchMode |= WHOLE_WORLD;
    }
    if (isWildcard) {
      searchMode |= WILD_CARD;
    }
    if (isRegex) {
      searchMode |= REGEX;
    }
    if (isSearchUp && !isFull) {
      searchMode |= SEARCH_UP;
    }
    if (isAmbientString || isFull) {
      searchMode |= AMBIENT_STRING;
    }

    return searchMode;
  };

  runSearchListeners = () => {
    const {
      searchValue,
      searchListeners,
      isCaseSensitive,
      isWholeWord,
      isWildcard,
      isRegex,
      isAmbientString,
      isSearchUp,
      searchResults,
    } = this.props;

    searchListeners.forEach(listener => {
      listener(
        searchValue,
        {
          caseSensitive: isCaseSensitive,
          wholeWord: isWholeWord,
          wildcard: isWildcard,
          regex: isRegex,
          searchUp: isSearchUp,
          ambientString: isAmbientString,
        },
        searchResults,
      );
    });
  };

  onChange = e => {
    const { setSearchValue } = this.props;
    const searchValue = e.target.value;
    setSearchValue(searchValue);
  };

  search = () => {
    const { isSearchPanelOpen } = this.props;
    this.searchTextInput.current.blur();
    if (isSearchPanelOpen) {
      this.clearSearchResults();
      this.executeDebouncedFullSearch();
    }
  }

  onKeyDown = e => {
    if (e.which === 13) {
      // Enter
      this.search();
    }
  };

  onClickNext = e => {
    e.preventDefault();
    const { isSearchPanelOpen, activeResultIndex, searchResults } = this.props;

    if (isSearchPanelOpen) {
      if (searchResults.length === 0) {
        return;
      }
      const nextResultIndex = activeResultIndex === searchResults.length - 1 ? 0 : activeResultIndex + 1;
      core.setActiveSearchResult(searchResults[nextResultIndex]);
    }
  };

  onClickPrevious = e => {
    e.preventDefault();
    const { isSearchPanelOpen, activeResultIndex, searchResults, } = this.props;

    if (isSearchPanelOpen) {
      if (searchResults.length === 0) {
        return;
      }
      const prevResultIndex = activeResultIndex <= 0 ? searchResults.length - 1 : activeResultIndex - 1;
      core.setActiveSearchResult(searchResults[prevResultIndex]);
    }
  };

  onChangeCaseSensitive = e => {
    this.props.setCaseSensitive(e.target.checked);
    this.clearSearchResults();
    this.executeDebouncedFullSearch();
  };

  onChangeWholeWord = e => {
    this.props.setWholeWord(e.target.checked);
    this.clearSearchResults();
    this.executeDebouncedFullSearch();
  };

  onChangeWildcard = e => {
    this.props.setWildcard(e.target.checked);
    this.clearSearchResults();
    this.executeDebouncedFullSearch();
  }

  render() {
    const { isDisabled, t, searchResults, searchValue } = this.props;

    if (isDisabled) {
      return null;
    }

    const numberOfResultsFound = searchResults ? searchResults.length : 0;
    return (
      <div className="SearchOverlay">
        <div className="input-container">
          <input
            ref={this.searchTextInput}
            type="text"
            autoComplete="off"
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={searchValue}
            placeholder={t('message.searchDocumentPlaceholder')}
            aria-label={t('message.searchDocumentPlaceholder')}
            id="SearchPanel__input"
          />
          <button
            className="input-button"
            onClick={this.search}
            aria-label={t('message.searchDocumentPlaceholder')}
          >
            <Icon glyph="icon-header-search" />
          </button>
        </div>
        <div className="options">
          <Choice
            dataElement="caseSensitiveSearchOption"
            id="case-sensitive-option"
            ref={this.caseSensitiveInput}
            onChange={this.onChangeCaseSensitive}
            label={t('option.searchPanel.caseSensitive')}
          />
          <Choice
            dataElement="wholeWordSearchOption"
            id="whole-word-option"
            ref={this.wholeWordInput}
            onChange={this.onChangeWholeWord}
            label={t('option.searchPanel.wholeWordOnly')}
          />
          <Choice
            dataElement="wildCardSearchOption"
            id="wild-card-option"
            ref={this.wildcardInput}
            onChange={this.onChangeWildcard}
            label={t('option.searchPanel.wildcard')}
          />
        </div>
        <div className="divider" />
        <div className="footer">
          {<div>{numberOfResultsFound} {t('message.numResultsFound')}</div>}
          <div className="buttons">
            <button
              className="button"
              onClick={this.onClickPrevious}
              aria-label={t('action.prevResult')}
            >
              <Icon className="arrow" glyph="icon-chevron-left" />
            </button>
            <button
              className="button"
              onClick={this.onClickNext}
              aria-label={t('action.nextResult')}
            >
              <Icon className="arrow" glyph="icon-chevron-right" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isSearchPanelOpen: selectors.isElementOpen(state, 'searchPanel'),
  isSearchPanelDisabled: selectors.isElementDisabled(state, 'searchPanel'),
  searchValue: selectors.getSearchValue(state),
  isCaseSensitive: selectors.isCaseSensitive(state),
  isWholeWord: selectors.isWholeWord(state),
  isAmbientString: selectors.isAmbientString(state),
  isSearchUp: selectors.isSearchUp(state),
  isWildcard: selectors.isWildcard(state),
  isRegex: selectors.isRegex(state),
  isProgrammaticSearch: selectors.isProgrammaticSearch(state),
  isProgrammaticSearchFull: selectors.isProgrammaticSearchFull(state),
  searchListeners: selectors.getSearchListeners(state),
  isDisabled: selectors.isElementDisabled(state, 'searchOverlay'),
  isOpen: selectors.isElementOpen(state, 'searchOverlay'),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  setSearchValue: actions.setSearchValue,
  resetSearch: actions.resetSearch,
  setCaseSensitive: actions.setCaseSensitive,
  setWholeWord: actions.setWholeWord,
  setWildcard: actions.setWildcard,
  setSearchError: actions.setSearchError,
  setIsProgrammaticSearch: actions.setIsProgrammaticSearch,
  setIsProgrammaticSearchFull: actions.setIsProgrammaticSearchFull,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchOverlay);
