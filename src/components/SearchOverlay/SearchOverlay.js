import React from 'react';
import PropTypes from 'prop-types';
import core from 'core';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';

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
  const { searchValue, setSearchValue, executeSearch, replaceValue, nextResultValue, setReplaceValue } = props;
  const { isCaseSensitive, setCaseSensitive, isWholeWord, setWholeWord, isWildcard, setWildcard, setSearchStatus, isSearchInProgress, setIsSearchInProgress } = props;
  const { searchStatus, isPanelOpen } = props;
  const [isReplaceBtnDisabled, setReplaceBtnDisabled] = React.useState(true);
  const [isReplaceAllBtnDisabled, setReplaceAllBtnDisabled] = React.useState(true);
  const [isMoreOptionsOpen, setMoreOptionOpen] = React.useState(true);
  const [showReplaceSpinner, setShowReplaceSpinner] = React.useState(false);

  const isSearchAndReplaceDisabled = useSelector((state) => selectors.isElementDisabled(state, 'searchAndReplace'));
  const searchTextInputRef = React.useRef();
  const waitTime = 300; // Wait time in milliseconds

  React.useEffect(() => {
    if (searchTextInputRef.current && isPanelOpen) {
      searchTextInputRef.current.focus();
    }
  }, [isPanelOpen]);

  React.useEffect(() => {
    if (searchValue && searchValue.length > 0) {
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
      if (searchValue && searchValue.length > 0) {
        setIsSearchInProgress(true);
        executeSearch(searchValue, {
          caseSensitive: isCaseSensitive,
          wholeWord: isWholeWord,
          wildcard: isWildcard,
        });
      } else {
        clearSearchResult();
      }
    }, waitTime),
    [isCaseSensitive, isWholeWord, isWildcard]
  );

  const textInputOnChange = (event) => {
    setSearchValue(event.target.value);
    debouncedSearch(event.target.value);

    if (event.target.value && replaceValue) {
      setReplaceBtnDisabled(false);
      setReplaceAllBtnDisabled(false);
    }
  };

  const replaceTextInputOnChange = (event) => {
    setReplaceValue(event.target.value);
    if (event.target.value && searchValue) {
      setReplaceBtnDisabled(false);
      setReplaceAllBtnDisabled(false);
    }
  };

  function clearSearchResult() {
    core.clearSearchResults();
    setSearchValue('');
    setSearchStatus('SEARCH_NOT_INITIATED');
    setReplaceValue('');
    setReplaceBtnDisabled(true);
    setReplaceAllBtnDisabled(true);
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

  const searchAndReplaceAll = React.useCallback(
    async function searchAndReplaceAllCallback() {
      if (isReplaceAllBtnDisabled && nextResultValue) {
        return;
      }
      setShowReplaceSpinner(true);
      await window.instance.Core.ContentEdit.searchAndReplaceText({
        documentViewer: window.instance.Core.documentViewer,
        searchResults: core.getPageSearchResults(),
        replaceWith: replaceValue,
      });
      setShowReplaceSpinner(false);
    },
    [replaceValue]
  );

  const toggleMoreOptionsBtn = () => {
    window.localStorage.setItem('searchMoreOption', !isMoreOptionsOpen);
    setMoreOptionOpen(!isMoreOptionsOpen);
  };

  const searchAndReplaceOne = React.useCallback(
    async function searchAndReplaceOneCallback() {
      if (isReplaceBtnDisabled && nextResultValue) {
        return;
      }
      setShowReplaceSpinner(true);

      await window.instance.Core.ContentEdit.searchAndReplaceText({
        documentViewer: window.instance.Core.documentViewer,
        replaceWith: replaceValue,
        searchResults: [core.getActiveSearchResult()],
      });

      setShowReplaceSpinner(false);
    },
    [replaceValue, nextResultValue, isReplaceBtnDisabled]
  );

  const dispatch = useDispatch();

  const replaceAllConfirmationWarning = () => {
    const title = t('option.searchPanel.replaceText');
    const message = t('option.searchPanel.confirmMessageReplaceAll');
    const confirmationWarning = {
      message,
      title,
      confirmBtnText: t('option.searchPanel.confirm'),
      onConfirm: () => {
        searchAndReplaceAll();
      },
    };
    dispatch(actions.showWarningMessage(confirmationWarning));
  };

  const replaceOneConfirmationWarning = () => {
    const title = t('option.searchPanel.replaceText');
    const message = t('option.searchPanel.confirmMessageReplaceOne');
    const confirmationWarning = {
      message,
      title,
      confirmBtnText: t('option.searchPanel.confirm'),
      onConfirm: () => {
        searchAndReplaceOne();
      },
    };
    dispatch(actions.showWarningMessage(confirmationWarning));
  };

  if (isSearchOverlayDisabled) {
    return null;
  }
  const numberOfResultsFound = searchResults ? searchResults.length : 0;

  const showSpinner = (isSearchInProgress)
    ? <Spinner />
    : (searchStatus === 'SEARCH_DONE' && !isProcessingSearchResults)
      ? (<div>{numberOfResultsFound} {t('message.numResultsFound')}</div>)
      : <Spinner />;


  const searchOptionsComponents = (<div className="options">
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
  </div>);

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
      {
        (isSearchAndReplaceDisabled) ? null :
          (isMoreOptionsOpen)
            ? <div className="extra-options">
              <button className='Button' onClick={toggleMoreOptionsBtn}>{t('option.searchPanel.lessOptions')} <Icon glyph="icon-chevron-up"/></button>
            </div>
            : <div className="extra-options">
              <button className='Button' onClick={toggleMoreOptionsBtn}>{t('option.searchPanel.moreOptions')} <Icon glyph="icon-chevron-down"/></button>
            </div>
      }
      {
        (!isMoreOptionsOpen) ? searchOptionsComponents :
          <div>
            {searchOptionsComponents}
            {
              (isSearchAndReplaceDisabled) ? null :
                <div data-element="searchAndReplace" className='replace-options'>
                  <p>{t('option.searchPanel.replace')}</p>
                  <div className='input-container'>
                    <input type={'text'}
                      onChange={replaceTextInputOnChange}
                      value={replaceValue}
                    />
                  </div>
                  <div className='replace-buttons'>
                    { (showReplaceSpinner) ? <Spinner width={25} height={25} /> : null }
                    <button className='Button btn-replace-all' disabled={isReplaceAllBtnDisabled}
                      onClick={replaceAllConfirmationWarning}>{t('option.searchPanel.replaceAll')}</button>
                    <button className='Button btn-replace' disabled={isReplaceBtnDisabled || !nextResultValue || !core.getActiveSearchResult()}
                      onClick={replaceOneConfirmationWarning}>{t('option.searchPanel.replace')}</button>
                  </div>
                </div>
            }
          </div>
      }

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
