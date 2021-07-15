import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import SearchPanel from './SearchPanel';

function SearchPanelContainer(props) {
  const isMobile = useMedia(['(max-width: 640px)'],[true], false);

  const [isOpen, currentWidth, pageLabels, shouldClearSearchPanelOnClose, isInDesktopOnlyMode] = useSelector(state => [
    selectors.isElementOpen(state, 'searchPanel'),
    selectors.getSearchPanelWidth(state),
    selectors.getPageLabels(state),
    selectors.shouldClearSearchPanelOnClose(state),
    selectors.isInDesktopOnlyMode(state)
  ], shallowEqual);

  const dispatch = useDispatch();
  const closeSearchPanel = React.useCallback(function closeSearchPanel() {
    dispatch(actions.closeElements(['searchPanel']));
  }, [dispatch]);

  const clearSearchInputValue = React.useCallback(function clearSearchInputValue() {
    dispatch(actions.setSearchValue(''));
  }, [dispatch]);

  const setActiveResult = React.useCallback(function setActiveResult(result) {
    core.setActiveSearchResult(result);
  }, []);

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

  React.useEffect(function clearSearchResult() {
    if (!isInDesktopOnlyMode && isMobile) {
      // for mobile we want to keep results in panel as search panel is on top of the content
      // and user will need to close the panel to view the content.
      return;
    }

    if (!isOpen && shouldClearSearchPanelOnClose) {
      core.clearSearchResults();
      clearSearchInputValue();
    }
  }, [isMobile, isOpen, shouldClearSearchPanelOnClose, isInDesktopOnlyMode]);

  const combinedProps = {
    ...props,
    isOpen,
    currentWidth,
    pageLabels,
    closeSearchPanel,
    setActiveResult,
    isMobile,
    isInDesktopOnlyMode
  };

  return (
    <SearchPanel {...combinedProps} />
  );
}

export default SearchPanelContainer;
