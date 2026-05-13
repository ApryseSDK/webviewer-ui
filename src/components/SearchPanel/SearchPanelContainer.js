import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import useCore from 'hooks/useCore';
import actions from 'actions';
import selectors from 'selectors';
import { isMobileSize } from 'helpers/getDeviceSize';
import SearchPanel from './SearchPanel';
import DataElements from 'constants/dataElement';
import { RESIZE_BAR_WIDTH } from 'constants/panel';

function SearchPanelContainer(props) {
  const { core } = useCore();
  const { dataElement = DataElements.SEARCH_PANEL, parentDataElement = undefined } = props;
  const isMobile = isMobileSize();

  const isOpen = useSelector((state) => selectors.isElementOpen(state, dataElement), shallowEqual);
  const shouldClearSearchPanelOnClose = useSelector((state) => selectors.shouldClearSearchPanelOnClose(state), shallowEqual);
  const isInDesktopOnlyMode = useSelector((state) => selectors.isInDesktopOnlyMode(state), shallowEqual);
  const isProcessingSearchResults = useSelector((state) => selectors.isProcessingSearchResults(state), shallowEqual);
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state), shallowEqual);
  const pageLabels = useSelector((state) => selectors.getPageLabels(state, activeDocumentViewerKey), shallowEqual);
  let currentWidth = useSelector((state) => (
    !parentDataElement && dataElement === DataElements.SEARCH_PANEL ?
      selectors.getSearchPanelWidth(state) :
      selectors.getPanelWidth(state, parentDataElement || dataElement)
  ));

  const dispatch = useDispatch();
  const closeSearchPanel = React.useCallback(
    function closeSearchPanel() {
      dispatch(actions.closeElements([dataElement]));
    },
    [dispatch],
  );

  const clearSearchInputValue = React.useCallback(
    function clearSearchInputValue() {
      dispatch(actions.setSearchValue(''));
    },
    [dispatch],
  );

  const setNextResultValue = React.useCallback(
    function setNextResultValue(searchResults) {
      dispatch(actions.setNextResultValue(searchResults));
    },
    [dispatch],
  );

  const setActiveResult = React.useCallback(function setActiveResult(result) {
    const activeDocumentViewer = core.getDocumentViewer();
    return activeDocumentViewer.setActiveSearchResult(result);
  }, [core]);

  /*
  React.useEffect(function SearchPanelVisibilityChangedEffect() {
    function clearSearchResultsOnPanelClose(event) {
      if (!event && !event.detail) {
        return;
      }
      const { detail } = event;
      if (detail.element === 'searchPanel' && detail.isVisible === false) {
        // clear search results when search panel is closed
        core.clearSearchResults();
        clearSearchInputValue();
      }
    }
    if (isMobile) {
      // for mobile we want to keep results in panel as search panel is on top of the content
      // and user will need to close the panel to view the content.
      return;
    }
    if (!shouldClearSearchPanelOnClose) {
      return;
    }
    window.addEventListener('visibilityChanged',  clearSearchResultsOnPanelClose);
    return function SearchPanelVisibilityChangedEffectCleanUp() {
      window.removeEventListener('visibilityChanged',  clearSearchResultsOnPanelClose);
    };
  }, [isMobile, clearSearchInputValue, shouldClearSearchPanelOnClose]);
   */

  React.useEffect(
    function clearSearchResult() {
      if (!isInDesktopOnlyMode && isMobile) {
        // for mobile we want to keep results in panel as search panel is on top of the content
        // and user will need to close the panel to view the content.
        return;
      }

      if (!isOpen && shouldClearSearchPanelOnClose) {
        core.clearSearchResults();
        clearSearchInputValue();
      }
    },
    [isMobile, isOpen, shouldClearSearchPanelOnClose, isInDesktopOnlyMode, core],
  );

  React.useEffect(() => {
    return () => {
      if (!isInDesktopOnlyMode && isMobile) {
        // for mobile we want to keep results in panel as search panel is on top of the content
        // and user will need to close the panel to view the content.
        return;
      }

      if (shouldClearSearchPanelOnClose) {
        core.clearSearchResults();
        clearSearchInputValue();
      }
    };
  }, [isMobile, shouldClearSearchPanelOnClose, isInDesktopOnlyMode, core]);

  if (dataElement !== DataElements.SEARCH_PANEL) {
    // Adjust width for custom panels
    currentWidth -= 16; // padding
    currentWidth -= RESIZE_BAR_WIDTH;
  }

  const combinedProps = {
    ...props,
    isOpen,
    currentWidth,
    pageLabels,
    closeSearchPanel,
    setActiveResult,
    setNextResultValue,
    isMobile,
    isInDesktopOnlyMode,
    isProcessingSearchResults,
    activeDocumentViewerKey,
  };

  return <SearchPanel {...combinedProps} />;
}

export default SearchPanelContainer;
