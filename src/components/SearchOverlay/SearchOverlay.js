import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import onClickOutside from 'react-onclickoutside';

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
    results: PropTypes.arrayOf(PropTypes.object),
    activeResult: PropTypes.object,
    activeResultIndex: PropTypes.number,
    isProgrammaticSearch: PropTypes.bool,
    isProgrammaticSearchFull: PropTypes.bool,
    searchListeners: PropTypes.arrayOf(PropTypes.func),
    openElement: PropTypes.func.isRequired,
    openElements: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    setActiveResult: PropTypes.func.isRequired,
    setActiveResultIndex: PropTypes.func.isRequired,
    setIsSearching: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    addResult: PropTypes.func.isRequired,
    setCaseSensitive: PropTypes.func.isRequired,
    setWholeWord: PropTypes.func.isRequired,
    setWildcard: PropTypes.func.isRequired,
    setNoResult: PropTypes.func.isRequired,
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
    this.executeDebouncedSingleSearch = debounce(this.executeSingleSearch, 300);
    this.executeDebouncedFullSearch = debounce(this.executeFullSearch, 300);
    this.currentSingleSearchTerm = '';
    this.foundSingleSearchResult = false;
    this.state = {
      noResultSingleSearch: false,
    };
  }

  componentDidMount() {
    this.searchTextInput.current.focus();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isProgrammaticSearch) {
      this.clearSearchResults();
      this.executeSingleSearch();
      this.props.setIsProgrammaticSearch(false);
    } else if (this.props.isProgrammaticSearchFull) {
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
      this.props.closeElement('searchPanel');
      this.clearSearchResults();
    }
  }

  handleSearchError = error => {
    const { setIsSearching, setSearchError } = this.props;
    setIsSearching(false);
    if (error && error.message) {
      setSearchError(error.message);
    }
  }

  handleClickOutside = e => {
    const { closeElements, isSearchPanelOpen } = this.props;
    const clickedSearchButton =
      e.target.getAttribute('data-element') === 'searchButton';

    if (!isSearchPanelOpen && !clickedSearchButton) {
      closeElements(['searchOverlay']);
    }
  };

  clearSearchResults = () => {
    core.clearSearchResults();
    this.props.resetSearch();
  };

  executeFullSearch = () => {
    const {
      searchValue,
      addResult,
      setIsSearching,
      setNoResult,
      setActiveResultIndex,
    } = this.props;
    const isFullSearch = true;
    const searchMode = this.getSearchMode(isFullSearch);
    let resultIndex = -1;
    let noActiveResultIndex = true;
    let noResult = true;
    const handleSearchResult = result => {
      const foundResult =
        result.resultCode === window.CoreControls.Search.ResultCode.FOUND;
      const isSearchDone =
        result.resultCode === window.CoreControls.Search.ResultCode.DONE;

      if (foundResult) {
        resultIndex++;
        noResult = false;
        addResult(result);
        core.displayAdditionalSearchResult(result);
        if (noActiveResultIndex && this.isActiveResult(result)) {
          noActiveResultIndex = false;
          setActiveResultIndex(resultIndex);
          core.setActiveSearchResult(result);
        }
      }
      if (isSearchDone) {
        setIsSearching(false);
        setNoResult(noResult);
        this.runSearchListeners();
      }
    };


    setIsSearching(true);

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
    const {
      isCaseSensitive,
      isWholeWord,
      isWildcard,
      isRegex,
      isSearchUp,
      isAmbientString,
    } = this.props;
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

  isActiveResult = result => {
    const { activeResult } = this.props;

    if (!activeResult) {
      return true;
    }

    const inSamePage = activeResult.pageNum === result.pageNum;
    const hasSameCoordinates =
      Object.values(activeResult.quads[0]).toString() ===
      Object.values(result.quads[0]).toString();

    return inSamePage && hasSameCoordinates;
  };

  executeSingleSearch = (isSearchUp = false) => {
    const {
      searchValue,
      setActiveResult,
      setIsSearching,
      addResult,
      resetSearch,
    } = this.props;
    const searchMode = isSearchUp
      ? this.getSearchMode() | core.getSearchMode().SEARCH_UP
      : this.getSearchMode();
    const isFullSearch = false;

    if (this.currentSingleSearchTerm !== searchValue) {
      this.currentSingleSearchTerm = searchValue;
      this.foundSingleSearchResult = false;
      this.setState({ noResultSingleSearch: false });
      core.clearSearchResults();
    }

    resetSearch();
    const handleSearchResult = result => {
      const foundResult =
        result.resultCode === window.CoreControls.Search.ResultCode.FOUND;
      const isSearchDone =
        result.resultCode === window.CoreControls.Search.ResultCode.DONE;

      if (foundResult) {
        this.foundSingleSearchResult = true;
        addResult(result);
        core.displaySearchResult(result);
        setActiveResult(result);
        this.runSearchListeners();
      }

      if (isSearchDone) {
        core.getDocumentViewer().trigger('endOfDocumentResult', true);
        if (!this.foundSingleSearchResult) {
          this.setState({ noResultSingleSearch: true });
        }
      }
      setIsSearching(false);
    };

    setIsSearching(true);

    const options = {
      'fullSearch': isFullSearch,
      'onResult': handleSearchResult,
      'onPageEnd': handleSearchResult,
      'onDocumentEnd': handleSearchResult,
      'onError': this.handleSearchError.bind(this),
    };
    core.textSearchInit(searchValue, searchMode, options);
  }

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
      results,
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
        results,
      );
    });
  };

  onChange = e => {
    const { isSearchPanelOpen, setSearchValue } = this.props;
    const searchValue = e.target.value;

    setSearchValue(searchValue);

    // if (searchValue.trim()) {
    //   if (isSearchPanelOpen) {
    //     this.clearSearchResults();
    //     this.executeDebouncedFullSearch();
    //   } else {
    //     this.executeDebouncedSingleSearch();
    //   }
    // } else {
    //   this.clearSearchResults();
    // }
  };

  search = () => {
    const { isSearchPanelOpen } = this.props;

    this.searchTextInput.current.blur();
    if (isSearchPanelOpen) {
      this.clearSearchResults();
      this.executeDebouncedFullSearch();
    } else {
      this.executeDebouncedSingleSearch();
    }
  }

  onKeyDown = e => {
    const shouldOpenSearchPanel =
      !this.props.isSearchPanelDisabled &&
      (e.metaKey || e.ctrlKey) && e.which === 13;

    if (e.shiftKey && e.which === 13) {
      // Shift + Enter
      this.onClickPrevious(e);
    } else if (shouldOpenSearchPanel) {
      // (Cmd/Ctrl + Enter)
      this.onClickOverflow(e);
    } else if (e.which === 13) {
      // Enter
      // this.onClickNext(e);
      this.search();
    }
  };

  onClickNext = e => {
    e.preventDefault();
    const {
      isSearchPanelOpen,
      activeResultIndex,
      results,
      setActiveResultIndex,
    } = this.props;

    if (isSearchPanelOpen) {
      if (results.length === 0) {
        return;
      }
      const nextResultIndex =
        activeResultIndex === results.length - 1 ? 0 : activeResultIndex + 1;
      setActiveResultIndex(nextResultIndex);
      core.setActiveSearchResult(results[nextResultIndex]);
    } else {
      this.executeSingleSearch();
    }
  };

  onClickPrevious = e => {
    e.preventDefault();
    const {
      isSearchPanelOpen,
      activeResultIndex,
      results,
      setActiveResultIndex,
    } = this.props;

    if (isSearchPanelOpen) {
      if (results.length === 0) {
        return;
      }
      const prevResultIndex = activeResultIndex <= 0 ? results.length - 1 : activeResultIndex - 1;
      setActiveResultIndex(prevResultIndex);
      core.setActiveSearchResult(results[prevResultIndex]);
    } else {
      const isSearchUp = true;
      this.executeSingleSearch(isSearchUp);
    }
  };

  onClickOverflow = () => {
    const { activeResult, openElement, setActiveResult } = this.props;

    openElement('searchPanel');
    this.clearSearchResults();
    setActiveResult(activeResult);
    this.executeFullSearch();
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
    const {
      isDisabled,
      t,
      isSearchPanelOpen,
      isSearchPanelDisabled,
      results,
      searchValue,
      activeResultIndex,
      isWildCardSearchDisabled,
      isCaseSensitive,
      isWholeWord,
      isSearching,
    } = this.props;

    if (isDisabled) {
      return null;
    }

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
          {<div>{results.length} {t('message.numResultsFound')}</div>}
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
  isSearching: selectors.isSearching(state),
  isSearchPanelOpen: selectors.isElementOpen(state, 'searchPanel'),
  isSearchPanelDisabled: selectors.isElementDisabled(state, 'searchPanel'),
  searchValue: selectors.getSearchValue(state),
  isCaseSensitive: selectors.isCaseSensitive(state),
  isWholeWord: selectors.isWholeWord(state),
  isAmbientString: selectors.isAmbientString(state),
  isSearchUp: selectors.isSearchUp(state),
  isWildcard: selectors.isWildcard(state),
  isRegex: selectors.isRegex(state),
  results: selectors.getResults(state),
  activeResult: selectors.getActiveResult(state),
  activeResultIndex: selectors.getActiveResultIndex(state),
  isProgrammaticSearch: selectors.isProgrammaticSearch(state),
  isProgrammaticSearchFull: selectors.isProgrammaticSearchFull(state),
  searchListeners: selectors.getSearchListeners(state),
  isDisabled: selectors.isElementDisabled(state, 'searchOverlay'),
  isOpen: selectors.isElementOpen(state, 'searchOverlay'),
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  openElements: actions.openElements,
  closeElement: actions.closeElement,
  closeElements: actions.closeElements,
  setSearchValue: actions.setSearchValue,
  setActiveResult: actions.setActiveResult,
  setActiveResultIndex: actions.setActiveResultIndex,
  setIsSearching: actions.setIsSearching,
  resetSearch: actions.resetSearch,
  addResult: actions.addResult,
  setCaseSensitive: actions.setCaseSensitive,
  setWholeWord: actions.setWholeWord,
  setWildcard: actions.setWildcard,
  setNoResult: actions.setNoResult,
  setSearchError: actions.setSearchError,
  setIsProgrammaticSearch: actions.setIsProgrammaticSearch,
  setIsProgrammaticSearchFull: actions.setIsProgrammaticSearchFull,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(onClickOutside(SearchOverlay)));
