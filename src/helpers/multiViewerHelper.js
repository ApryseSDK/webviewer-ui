import { useStore, useSelector } from 'react-redux';
import { SYNC_MODES } from 'constants/multiViewerContants';
import { zoomTo } from 'helpers/zoom';
import core from 'core';
import selectors from 'selectors';
import { useState, useEffect } from 'react';

const multiViewerHelper = {
  matchedPages: null,
  isScrolledByClickingChangeItem: false,
};

export const setIsScrolledByClickingChangeItem = (value) => {
  multiViewerHelper.isScrolledByClickingChangeItem = value;
};

export const getIsScrolledByClickingChangeItem = () => {
  return multiViewerHelper.isScrolledByClickingChangeItem;
};

export default multiViewerHelper;

const documentViewerKeys = [1, 2];
let syncState = {
  scrollTop1: 0,
  scrollTop2: 0,
  currentScrollContainer: null,
  topOverflow1: 0,
  topOverflow2: 0,
  page1: 1,
  page2: 1,
  currentZoomContainer: null,
  incrementAfterZoom: null,
};
let removeHandlerFunctions = [];
const getOtherViewerNumber = (documentViewerKey) => documentViewerKey === 1 ? 2 : 1;

export const useMultiViewerSync = (container, container2) => {
  const store = useStore();
  const customMultiViewerSyncHandler = useSelector(selectors.getCustomMultiViewerSyncHandler);
  const syncViewer = useSelector(selectors.getSyncViewer);
  const multiViewerSyncScrollMode = useSelector(selectors.getMultiViewerSyncScrollMode);
  const [isSyncing, setIsSyncing] = useState(false);
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);

  const shouldSkipSyncEvent = () => {
    const state = store.getState();
    return core.getDocumentViewers().length < 2 || !core.getDocument(1) || !core.getDocument(2) ||
      !selectors.isMultiViewerMode(state) || !selectors.getSyncViewer(state);
  };
  const getContainer = (documentViewerKey) => documentViewerKey === 1 ? container.current : container2.current;

  const syncAfterZoom = (e, documentViewerKey) => {
    const { scrollTop } = e.target;
    const diffTop = scrollTop - syncState[`scrollTop${documentViewerKey}`];
    if (syncState.currentZoomContainer === documentViewerKey) {
      syncState.incrementAfterZoom = diffTop;
      syncState.currentScrollContainer = documentViewerKey;
    } else {
      const missingDiff = syncState.incrementAfterZoom - diffTop;
      e.target.scrollTop += missingDiff;
      syncState.currentZoomContainer = null;
      syncState.currentScrollContainer = null;
    }
    syncState[`scrollTop${documentViewerKey}`] = e.target.scrollTop;
    syncScrollLeft(e, documentViewerKey);
  };
  const syncScrollLeft = (e, documentViewerKey) => {
    const { scrollLeft } = e.target;
    const otherViewerNumber = getOtherViewerNumber(documentViewerKey);
    const otherContainer = getContainer(otherViewerNumber);
    // Match Horizontal scroll percentages (regardless of mode)
    const maxScrollLeft = e.target.scrollWidth - e.target.clientWidth;
    const scrollLeftPercentage = scrollLeft / maxScrollLeft;
    const otherContainerMaxScrollLeft = otherContainer.scrollWidth - otherContainer.clientWidth;
    otherContainer.scrollLeft = otherContainerMaxScrollLeft * scrollLeftPercentage;
  };
  const syncSkipUnmatched = (e, documentViewerKey) => {
    const otherViewerNumber = getOtherViewerNumber(documentViewerKey);
    const otherContainer = getContainer(otherViewerNumber);

    const { scrollTop } = e.target;
    const diffTop = scrollTop - syncState[`scrollTop${documentViewerKey}`];

    const { matchedPages } = multiViewerHelper;
    const documentViewer = core.getDocumentViewer(documentViewerKey);
    const otherDocumentViewer = core.getDocumentViewer(otherViewerNumber);
    const visiblePages = documentViewer.getDisplayModeManager().getDisplayMode().getVisiblePages();
    const mainPage = visiblePages[0];
    if (matchedPages[documentViewerKey][mainPage]) {
      const { otherSidePages, thisSidePages } = matchedPages[documentViewerKey][mainPage];
      const mainPageBoundingRect = documentViewer.getViewerElement().querySelector(`#pageContainer${thisSidePages[0]}`)?.getBoundingClientRect();
      const otherSidePageBoundingRect = otherDocumentViewer.getViewerElement()
        .querySelector(`#pageContainer${otherSidePages[0]}`)?.getBoundingClientRect();
      const scrollRatio = otherSidePages.length / thisSidePages.length;
      const heightRatio = otherSidePageBoundingRect && mainPageBoundingRect ? otherSidePageBoundingRect.height / mainPageBoundingRect.height : 1;
      const currentDiffTop = otherSidePageBoundingRect && mainPageBoundingRect ? otherSidePageBoundingRect.top - mainPageBoundingRect.top : diffTop;
      const adjustedDiffTop = (scrollRatio !== 1 ? diffTop : currentDiffTop) * scrollRatio * heightRatio;
      otherContainer.scrollTop += adjustedDiffTop;
    } else {
      const visiblePageOtherSide = otherDocumentViewer.getDisplayModeManager().getDisplayMode().getVisiblePages();
      const otherMainPage = visiblePageOtherSide[0];
      const secondaryPage = visiblePageOtherSide[1];
      if (!matchedPages[otherViewerNumber][otherMainPage] || (secondaryPage && !matchedPages[otherViewerNumber][secondaryPage])) {
        otherContainer.scrollTop += diffTop;
      }
    }
  };
  const syncStandard = (e, documentViewerKey) => {
    const otherViewerNumber = getOtherViewerNumber(documentViewerKey);
    const otherContainer = getContainer(otherViewerNumber);

    const { scrollTop } = e.target;
    const diffTop = scrollTop - syncState[`scrollTop${documentViewerKey}`];
    const topOverflow = otherContainer.scrollTop + diffTop;
    const bottomOverflow = otherContainer.scrollHeight - otherContainer.scrollTop - diffTop - otherContainer.clientHeight;

    if (topOverflow < 0) {
      syncState[`topOverflow${otherViewerNumber}`] += topOverflow;
      otherContainer.scrollTop += diffTop;
    } else if (bottomOverflow < 0) {
      syncState[`topOverflow${otherViewerNumber}`] -= bottomOverflow;
      otherContainer.scrollTop += diffTop;
    } else {
      const isTopOverflowPositive = syncState[`topOverflow${otherViewerNumber}`] > 0;
      const isDiffTopPositive = diffTop > 0;
      const isZero = diffTop === 0 || syncState[`topOverflow${otherViewerNumber}`] === 0;
      if (isDiffTopPositive !== isTopOverflowPositive && !isZero) {
        syncState[`topOverflow${otherViewerNumber}`] += diffTop;
        if (syncState[`topOverflow${otherViewerNumber}`] > 0 !== isTopOverflowPositive) {
          otherContainer.scrollTop += syncState[`topOverflow${otherViewerNumber}`];
          syncState[`topOverflow${otherViewerNumber}`] = 0;
        }
      } else {
        otherContainer.scrollTop += diffTop - syncState[`topOverflow${documentViewerKey}`];
        syncState[`topOverflow${documentViewerKey}`] = 0;
      }
    }
  };

  const createOnScrollHandler = (documentViewerKey) => (e) => {
    if (shouldSkipSyncEvent()) {
      return;
    }
    const { scrollTop } = e.target;
    if (syncState.currentZoomContainer) {
      syncAfterZoom(e, documentViewerKey);
      return;
    }
    if (getIsScrolledByClickingChangeItem()) {
      syncState[`scrollTop${documentViewerKey}`] = scrollTop;
      if (documentViewerKey === 2) {
        setIsScrolledByClickingChangeItem(false);
      }
      return;
    }
    const otherViewerNumber = getOtherViewerNumber(documentViewerKey);
    if (syncState.currentScrollContainer !== otherViewerNumber) {
      syncState.currentScrollContainer = documentViewerKey;
      if (multiViewerSyncScrollMode === SYNC_MODES.SKIP_UNMATCHED && multiViewerHelper.matchedPages) {
        syncSkipUnmatched(e, documentViewerKey);
      } else {
        syncStandard(e, documentViewerKey);
      }
      syncScrollLeft(e, documentViewerKey);
    } else {
      syncState.currentScrollContainer = null;
    }
    syncState[`scrollTop${documentViewerKey}`] = scrollTop;
  };
  const createOnZoomHandler = (documentViewerKey) => (zoomLevel) => {
    if (shouldSkipSyncEvent()) {
      return;
    }
    if (!syncState.currentZoomContainer) {
      syncState.currentZoomContainer = documentViewerKey;
    }
    for (const documentViewerKey of documentViewerKeys) {
      if (core.getZoom(documentViewerKey) !== zoomLevel) {
        zoomTo(zoomLevel, isMultiViewerMode, documentViewerKey);
      }
    }
  };
  const createOnPageUpdateHandler = (documentViewerKey) => (nextPage) => {
    if (shouldSkipSyncEvent()) {
      return;
    }
    const otherViewerNumber = getOtherViewerNumber(documentViewerKey);
    if (syncState.currentScrollContainer !== otherViewerNumber) {
      syncState.currentScrollContainer = documentViewerKey;
      const diff = nextPage - syncState[`page${documentViewerKey}`];
      const newPage2 = core.getCurrentPage(otherViewerNumber) + diff;
      core.setCurrentPage(newPage2, otherViewerNumber);
    } else {
      syncState.currentScrollContainer = null;
    }
    syncState[`page${documentViewerKey}`] = nextPage;
  };

  const startSyncing = (primaryDocumentViewerKey) => {
    setIsSyncing(true);
    const zoomLevel = core.getZoom(primaryDocumentViewerKey);
    if (primaryDocumentViewerKey === 1) {
      zoomTo(zoomLevel, isMultiViewerMode, 2);
    } else if (primaryDocumentViewerKey === 2) {
      zoomTo(zoomLevel, isMultiViewerMode, 1);
    }
    const isScrollable = core.getDocumentViewer().getDisplayModeManager().getDisplayMode().isContinuous();
    for (const documentViewerKey of documentViewerKeys) {
      const onZoomHandler = createOnZoomHandler(documentViewerKey);
      core.addEventListener('zoomUpdated', onZoomHandler, undefined, documentViewerKey);
      removeHandlerFunctions.push(() => core.removeEventListener('zoomUpdated', onZoomHandler, documentViewerKey));
      const onScrollHandler = createOnScrollHandler(documentViewerKey);
      const containerRef = getContainer(documentViewerKey);
      containerRef.addEventListener('scroll', onScrollHandler);
      removeHandlerFunctions.push(() => containerRef.removeEventListener('scroll', onScrollHandler));
      if (!isScrollable) {
        const onPageUpdatedHandler = createOnPageUpdateHandler(documentViewerKey);
        core.addEventListener('pageNumberUpdated', onPageUpdatedHandler, undefined, documentViewerKey);
        removeHandlerFunctions.push(() => core.removeEventListener('pageNumberUpdated', onPageUpdatedHandler, documentViewerKey));
      }
    }

    if (multiViewerSyncScrollMode === SYNC_MODES.SKIP_UNMATCHED && multiViewerHelper.matchedPages) {
      container.current.scrollTop = 0;
      container2.current.scrollTop = 0;
    }

    syncState = {
      scrollTop1: container.current.scrollTop,
      scrollTop2: container2.current.scrollTop,
      topOverflow1: 0,
      topOverflow2: 0,
      page1: core.getCurrentPage(1),
      page2: core.getCurrentPage(2),
      currentZoomContainer: null,
      incrementAfterZoom: null,
    };

    if (customMultiViewerSyncHandler) {
      customMultiViewerSyncHandler(primaryDocumentViewerKey, removeHandlerFunctions);
    }
  };
  const stopSyncing = () => {
    setIsSyncing(false);
    syncState.topOverflow1 = 0;
    syncState.topOverflow2 = 0;
    removeHandlerFunctions.forEach((removeHandler) => removeHandler());
    removeHandlerFunctions = [];
  };

  useEffect(() => {
    if (isMultiViewerMode) {
      if (syncViewer && !isSyncing) {
        startSyncing(syncViewer);
      } else if (!syncViewer && isSyncing) {
        stopSyncing();
      }
    }
  }, [syncViewer]);

  return {
    stopSyncing,
    isSyncing,
  };
};