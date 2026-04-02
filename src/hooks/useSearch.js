import { useState, useMemo, useEffect, useCallback } from 'react';
import core from 'core';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions/index';
import { isSpreadsheetEditorMode } from 'src/helpers/officeEditor';
import selectors from 'selectors';
import { debounce } from 'lodash';
import { buildSearchModeArray } from 'src/helpers/search';

function useSearch(activeDocumentViewerKey) {
  const searchValue = useSelector(selectors.getSearchValue);
  const caseSensitive = useSelector(selectors.isCaseSensitive);
  const wholeWord = useSelector(selectors.isWholeWord);
  const searchStatus = useSelector(selectors.getSearchStatus);
  const [searchResults, setSearchResults] = useState([]);
  const [activeSearchResult, setActiveSearchResult] = useState();
  const [activeSearchResultIndex, setActiveSearchResultIndex] = useState(0);
  const dispatch = useDispatch();
  const documentViewers = core.getDocumentViewers();
  const documentViewersCount = documentViewers.length;
  const debounceTime = 500;

  const setSearchStatus = useCallback(async (status) => {
    dispatch(actions.setSearchStatus(status));
    if (status === 'SEARCH_IN_PROGRESS') {
      dispatch(actions.setSearchInProgress(true));
    } else {
      dispatch(actions.setSearchInProgress(false));
    }
  }, [dispatch]);

  const spreadsheetSearch = async (searchValue, modes) => {
    if (!searchValue) {
      setSearchStatus('SEARCH_NOT_INITIATED');
      return;
    }

    setSearchStatus('SEARCH_IN_PROGRESS');

    const searchModes = buildSearchModeArray(modes);
    const results = await core
      .getDocumentViewer()
      .search(searchValue, searchModes)
      .getAll();

    setSearchResults(results);
    setSearchStatus('SEARCH_DONE');
    dispatch(actions.setSearchInProgress(false));
  };

  const debouncedSearch = useMemo(() => debounce(spreadsheetSearch, debounceTime), []);

  const refreshSpreadsheetLabelsAndSearch = useCallback(() => {
    const workbook = core.getDocument().getSpreadsheetEditorDocument().getWorkbook();
    const sheetNames = [];
    for (let i = 0; i < workbook.sheetCount; i++) {
      const sheet = workbook.getSheetAt(i);
      sheetNames.push(sheet.name);
    }

    dispatch(actions.setPageLabels(sheetNames));
    debouncedSearch(searchValue, { wholeWord, caseSensitive });
  }, [searchValue, wholeWord, caseSensitive]);

  // Update search results on first mount and when active viewer changes
  // If results already exist in core, use those
  useEffect(() => {
    const activeDocumentViewer = core.getDocumentViewer(activeDocumentViewerKey);
    const coreSearchResults = activeDocumentViewer.getPageSearchResults() || [];
    setSearchResults(coreSearchResults);
    if (coreSearchResults.length > 0) {
      const activeSearchResult = activeDocumentViewer.getActiveSearchResult();
      const newActiveSearchResultIndex = activeSearchResult ? coreSearchResults.findIndex((searchResult) => {
        return core.isSearchResultEqual(searchResult, activeSearchResult);
      }) : -1;
      if (newActiveSearchResultIndex >= 0) {
        setActiveSearchResult(coreSearchResults[newActiveSearchResultIndex]);
        setActiveSearchResultIndex(newActiveSearchResultIndex);
      } else {
        // No active search result, so default to first
        setActiveSearchResult(coreSearchResults[0]);
        setActiveSearchResultIndex(0);
      }
    } else {
      setActiveSearchResult(undefined);
      setActiveSearchResultIndex(-1);
    }
  }, [activeDocumentViewerKey]);

  useEffect(() => {
    if (!isSpreadsheetEditorMode()) {
      return;
    }

    const onSpreadsheetSheetChanged = () => {
      if (!searchValue) {
        return;
      }

      refreshSpreadsheetLabelsAndSearch();
    };

    refreshSpreadsheetLabelsAndSearch();

    core.addEventListener('sheetChanged', onSpreadsheetSheetChanged);
    return () => {
      core.removeEventListener('sheetChanged', onSpreadsheetSheetChanged);
    };
  }, [searchValue, refreshSpreadsheetLabelsAndSearch]);

  useEffect(() => {
    const activeDocumentViewer = core.getDocumentViewer(activeDocumentViewerKey);
    function activeSearchResultChanged(newActiveSearchResult) {
      const coreSearchResults = activeDocumentViewer.getPageSearchResults() || [];
      const newActiveSearchResultIndex = coreSearchResults.findIndex((searchResult) => {
        return core.isSearchResultEqual(searchResult, newActiveSearchResult);
      });
      if (newActiveSearchResultIndex >= 0) {
        setActiveSearchResult(newActiveSearchResult);
        setActiveSearchResultIndex(newActiveSearchResultIndex);
        dispatch(actions.setNextResultValue(newActiveSearchResult));
      }
    }

    function searchResultsChanged(newSearchResults = []) {
      setSearchResults(newSearchResults);
      if (newSearchResults && newSearchResults.length === 0) {
        setActiveSearchResult(undefined);
        setActiveSearchResultIndex(-1);
      }
    }

    function searchInProgressEventHandler(isSearching) {
      if (isSearching === undefined || isSearching === null) {
        // if isSearching is not passed at all, we consider that to mean that search was reset to original state
        setSearchStatus('SEARCH_NOT_INITIATED');
      } else if (isSearching) {
        setSearchStatus('SEARCH_IN_PROGRESS');
      } else {
        const defaultActiveSearchResult = activeDocumentViewer.getActiveSearchResult();

        if (defaultActiveSearchResult) {
          setActiveSearchResult(defaultActiveSearchResult);
          // In core default active search result is the first result
          const coreSearchResults = activeDocumentViewer.getPageSearchResults() || [];
          const newActiveSearchResultIndex = coreSearchResults.findIndex((searchResult) => {
            return core.isSearchResultEqual(searchResult, defaultActiveSearchResult);
          });
          setActiveSearchResultIndex(newActiveSearchResultIndex);
          dispatch(actions.setNextResultValue(defaultActiveSearchResult));
        }

        setSearchStatus('SEARCH_DONE');
      }
    }
    const documentViewers = core.getDocumentViewers();

    documentViewers.forEach((documentViewer) => {
      documentViewer.addEventListener('activeSearchResultChanged', activeSearchResultChanged);
      documentViewer.addEventListener('searchResultsChanged', searchResultsChanged);
      documentViewer.addEventListener('searchInProgress', searchInProgressEventHandler);
    });
    return () => {
      documentViewers.forEach((documentViewer) => {
        documentViewer.removeEventListener('activeSearchResultChanged', activeSearchResultChanged);
        documentViewer.removeEventListener('searchResultsChanged', searchResultsChanged);
        documentViewer.removeEventListener('searchInProgress', searchInProgressEventHandler);
      });
    };
  }, [setActiveSearchResult, setActiveSearchResultIndex, setSearchStatus, dispatch, documentViewersCount, activeDocumentViewerKey]);

  return {
    searchStatus,
    searchResults,
    activeSearchResult,
    activeSearchResultIndex,
    refreshSpreadsheetLabelsAndSearch,
    setActiveSearchResultIndex,
    setSearchStatus,
  };
}

export default useSearch;
