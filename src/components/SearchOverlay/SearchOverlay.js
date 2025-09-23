import React, { useEffect, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import core from 'core';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import throttle from 'lodash/throttle';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';

import Icon from 'components/Icon';
import Button from 'components/Button';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import Spinner from '../Spinner';
import SearchOptionsFlyout from './SearchOptionsFlyout';
import { getInstanceNode } from 'helpers/getRootNode';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import './SearchOverlay.scss';
import '../Button/Button.scss';

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
  isProcessingSearchResults: PropTypes.bool,
  activeDocumentViewerKey: PropTypes.number,
};

function SearchOverlay(props) {
  const { t } = useTranslation();
  const { isSearchOverlayDisabled, searchResults, activeResultIndex, selectNextResult, selectPreviousResult, isProcessingSearchResults, activeDocumentViewerKey } = props;
  const { searchValue, setSearchValue, executeSearch, replaceValue, nextResultValue, setReplaceValue } = props;
  const { isCaseSensitive, setCaseSensitive, isWholeWord, setWholeWord, isWildcard, setWildcard, setSearchStatus, isSearchInProgress, setIsSearchInProgress } = props;
  const { searchStatus, isPanelOpen } = props;
  const [isReplaceBtnDisabled, setReplaceBtnDisabled] = useState(true);
  const [isReplaceAllBtnDisabled, setReplaceAllBtnDisabled] = useState(true);
  const [showReplaceSpinner, setShowReplaceSpinner] = useState(false);
  const [isReplacementRegexValid, setReplacementRegexValid] = useState(true);
  const [allowInitialSearch, setAllowInitialSearch] = useState(false);
  const [isReplaceInputActive, setisReplaceInputActive] = useState(false);
  const isSearchAndReplaceDisabled = useSelector((state) => selectors.isElementDisabled(state, 'searchAndReplace'));
  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);
  const searchTextInputRef = useRef();
  const waitTime = 300; // Wait time in milliseconds

  useEffect(() => {
    try {
      // eslint-disable-next-line no-unused-vars
      const replacementRegex = new RegExp('(?<!<\/?[^>]*|&[^;]*)');
    } catch (error) {
      setReplacementRegexValid(false);
    }
  }, []);

  useEffect(() => {
    if (numberOfResultsFound > 0) {
      setSearchStatus('SEARCH_DONE');
    }
  }, [searchResults]);

  useEffect(() => {
    if (searchTextInputRef.current && isPanelOpen) {
      // give time for the search panel to open before focusing on the input
      setTimeout(() => {
        searchTextInputRef.current.focus();
        setAllowInitialSearch(true);
      }, waitTime);
    }

    if (!isSearchAndReplaceDisabled && !isReplacementRegexValid && isPanelOpen) {
      console.warn('Search and Replace is not supported in this browser');
    }
  }, [isPanelOpen, isCaseSensitive]);

  useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      if (allowInitialSearch) {
        executeSearch(searchValue, {
          caseSensitive: isCaseSensitive,
          wholeWord: isWholeWord,
          wildcard: isWildcard,
        });
      }
    } else {
      clearSearchResult();
    }
  }, [isCaseSensitive, isWholeWord, isWildcard, activeDocumentViewerKey]);

  useEffect(() => {
    core.addEventListener('pagesUpdated', onPagesUpdated);
    return () => {
      core.removeEventListener('pagesUpdated', onPagesUpdated);
    };
  });

  const onPagesUpdated = (e) => {
    if (e.linearizedUpdate) {
      return;
    }
    search(searchValue);
  };

  const search = async (searchValue) => {
    if (searchValue && searchValue.length > 0) {
      setIsSearchInProgress(true);
      setSearchStatus('SEARCH_IN_PROGRESS');

      if (isOfficeEditorMode()) {
        await core.getDocument().getOfficeEditor().updateSearchData();
      }
      executeSearch(searchValue, {
        caseSensitive: isCaseSensitive,
        wholeWord: isWholeWord,
        wildcard: isWildcard,
      });
    } else {
      clearSearchResult();
    }
  };

  const debouncedSearch = useCallback(
    debounce(search, waitTime),
    [isCaseSensitive, isWholeWord, isWildcard]
  );

  const throttleSearch = useCallback(
    throttle(search, waitTime),
    [isCaseSensitive, isWholeWord, isWildcard]
  );

  useEffect(() => {
    const onOfficeDocumentEdited = () => {
      if (searchValue && searchValue.length > 0) {
        throttleSearch(searchValue);
      }
    };

    core.getDocument()?.addEventListener('officeDocumentEdited', onOfficeDocumentEdited);

    return () => {
      core.getDocument()?.removeEventListener('officeDocumentEdited', onOfficeDocumentEdited);
    };
  }, [searchValue]);

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

  const caseSensitiveSearchOptionOnChange = useCallback(
    function caseSensitiveSearchOptionOnChangeCallback(event) {
      const isChecked = event.target.checked;
      setCaseSensitive(isChecked);
    }, [],
  );

  const wholeWordSearchOptionOnChange = useCallback(
    function wholeWordSearchOptionOnChangeCallback(event) {
      const isChecked = event.target.checked;
      setWholeWord(isChecked);
    }, [],
  );

  const wildcardOptionOnChange = useCallback(
    function wildcardOptionOnChangeCallback(event) {
      const isChecked = event.target.checked;
      setWildcard(isChecked);
    }, [],
  );

  const nextButtonOnClick = useCallback(
    function nextButtonOnClickCallback() {
      if (selectNextResult) {
        selectNextResult(searchResults, activeResultIndex);
      }
    },
    [selectNextResult, searchResults, activeResultIndex],
  );

  const previousButtonOnClick = useCallback(
    function previousButtonOnClickCallback() {
      if (selectPreviousResult) {
        selectPreviousResult(searchResults, activeResultIndex);
      }
    },
    [selectPreviousResult, searchResults, activeResultIndex],
  );

  const searchAndReplaceAll = useCallback(
    async function searchAndReplaceAllCallback() {
      if (isReplaceAllBtnDisabled && nextResultValue) {
        return;
      }
      setShowReplaceSpinner(true);
      await getInstanceNode().instance.Core.ContentEdit.searchAndReplaceText({
        documentViewer: getInstanceNode().instance.Core.documentViewer,
        searchResults: core.getPageSearchResults(),
        replaceWith: replaceValue,
      });
      setShowReplaceSpinner(false);
    },
    [replaceValue]
  );

  const toggleReplaceInput = () => {
    setisReplaceInputActive(!isReplaceInputActive);
  };

  const searchAndReplaceOne = useCallback(
    async function searchAndReplaceOneCallback() {
      if (isReplaceBtnDisabled && nextResultValue) {
        return;
      }
      setShowReplaceSpinner(true);

      await getInstanceNode().instance.Core.ContentEdit.searchAndReplaceText({
        documentViewer: getInstanceNode().instance.Core.documentViewer,
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

  const isSearchDoneAndNotProcessingResults = searchStatus === 'SEARCH_DONE' && !isProcessingSearchResults;
  const showSpinner = (!isSearchDoneAndNotProcessingResults || isSearchInProgress) ? <Spinner /> : null;
  const shouldShowReplaceToggleButton = !isSearchAndReplaceDisabled && isReplacementRegexValid;
  const shouldShowReplaceInput = shouldShowReplaceToggleButton && isReplaceInputActive;
  const shouldShowDotOnFilterButton = isCaseSensitive || isWholeWord || isWildcard;

  return (
    <div className={classNames({
      'SearchOverlay': true,
      'modular-ui': customizableUI
    })}>
      <div className="search-input-row">
        <div className='input-container'>
          {customizableUI && <Icon glyph="icon-header-search" />}
          <input
            className='search-panel-input'
            ref={searchTextInputRef}
            type="text"
            autoComplete="off"
            onChange={textInputOnChange}
            value={searchValue}
            placeholder={customizableUI ? '' : t('message.searchDocumentPlaceholder')}
            aria-label={t('message.searchDocumentPlaceholder')}
            id="SearchPanel__input"
            tabIndex={isPanelOpen ? 0 : -1}
          />
          {(searchValue !== undefined) && searchValue.length > 0 && (
            <Button
              className="clearSearch-button"
              img="icon-close"
              onClick={clearSearchResult}
              title={t('message.clearSearchResults')}
              ariaLabel={t('message.clearSearchResults')}
              onClickAnnouncement={t('message.searchResultsCleared')}
            />
          )}
        </div>
        <div className="search-option-buttons">
          <ToggleElementButton
            dataElement="searchOptionsButton"
            title={t('message.toggleSearchOptions')}
            ariaLabel={t('message.toggleSearchOptions')}
            tabIndex={isPanelOpen ? 0 : -1}
            img={shouldShowDotOnFilterButton ? 'ic-filter-with-dot' : 'ic-filter-alt'}
            className={'search-options-button'}
            toggleElement={DataElements.SEARCH_OPTIONS_FLYOUT}
          />
          {
            shouldShowReplaceToggleButton ?
              <Button
                onClick={toggleReplaceInput}
                title={t('message.toggleReplaceInput')}
                ariaLabel={t('message.toggleReplaceInput')}
                tabIndex={isPanelOpen ? 0 : -1}
                img='ic_replace'
                className={'search-options-button'}
                isActive={isReplaceInputActive}
              /> : null
          }
        </div>
      </div>
      {shouldShowReplaceInput && (
        <div data-element="searchAndReplace" className="replace-options">
          <div className="input-container with-replace-icon">
            <Icon
              disabled={false}
              glyph={'ic_replace'}
              className={'replace-icon'}
            />
            <input type={'text'}
              aria-label={t('option.searchPanel.replace')}
              onChange={replaceTextInputOnChange}
              value={replaceValue}
            />
          </div>
          <div className='replace-buttons'>
            {(showReplaceSpinner) ? <Spinner width={25} height={25} /> : null}
            <button className='Button btn-replace-all' disabled={isReplaceAllBtnDisabled}
              aria-label={t('option.searchPanel.replaceAll')}
              onClick={replaceAllConfirmationWarning}>{t('option.searchPanel.replaceAll')}</button>
            <button className='Button btn-replace' disabled={isReplaceBtnDisabled || !nextResultValue || !core.getActiveSearchResult()}
              aria-label={t('option.searchPanel.replace')}
              onClick={replaceOneConfirmationWarning}>{t('option.searchPanel.replace')}</button>
          </div>
        </div>
      )}
      <SearchOptionsFlyout
        isCaseSensitive={isCaseSensitive}
        isWholeWord={isWholeWord}
        isWildcard={isWildcard}
        isPanelOpen={isPanelOpen}
        onCaseSensitiveSearchOptionChange={caseSensitiveSearchOptionOnChange}
        wholeWordSearchOptionOnChange={wholeWordSearchOptionOnChange}
        wildcardOptionOnChange={wildcardOptionOnChange}
      />
      <div className="divider" />
      <div className="footer">
        {searchStatus === 'SEARCH_NOT_INITIATED' || '' ? null : showSpinner}
        <p className="no-margin" aria-live="assertive">{isSearchDoneAndNotProcessingResults && !isSearchInProgress ? `${numberOfResultsFound} ${t('message.numResultsFound')}` : undefined}</p>
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
