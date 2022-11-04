import React, { useEffect, useRef, useState } from 'react';
import './MultiViewer.scss';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import { useSelector, useDispatch, useStore } from 'react-redux';
import DropArea from 'components/MultiViewer/DropArea';
import ResizeBar from 'components/ResizeBar';
import DocumentHeader from 'components/MultiViewer/DocumentHeader';
import DocumentContainer from 'components/MultiViewer/DocumentContainer';
import classNames from 'classnames';
import CompareZoomOverlay from 'components/MultiViewer/CompareZoomOverlay';
import eventHandler from 'helpers/eventHandler';
import { throttle } from 'lodash';
import { zoomTo } from 'helpers/zoom';
import ComparisonButton from 'components/MultiViewer/ComparisonButton';
import { addDocumentViewer, syncDocumentViewers, removeDocumentViewer } from 'helpers/documentViewerHelper';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import { DISABLED_TOOLS_KEYWORDS, DISABLED_TOOL_GROUPS } from 'constants/multiViewerDisabledTools';

const MIN_WIDTH = 350;

const MultiViewer = () => {
  const documentViewerKeys = [1, 2];
  const dispatch = useDispatch();
  const store = useStore();
  const [initialSetup, setInitialSetup] = useState(false);
  const oldHeaderItems = useRef({});
  const container = useRef();
  const container2 = useRef();
  const [doc1Loaded, setDoc1Loaded] = useState(false);
  const [doc2Loaded, setDoc2Loaded] = useState(false);
  const [width, setWidth] = useState(0);
  const [width2, setWidth2] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const removeHandlerFunctions = useRef([]);
  const funcRefs = useRef({
    updateScrollView: throttle(() => core.scrollViewUpdated(), 100, { leading: true }),
    resizeObserverFunc: throttle((records) => {
      const newWidth = records[0].contentRect.width;
      if (newWidth) {
        dispatch(actions.setDocumentContainerWidth(newWidth));
        if (width === 0 && width2 === 0) {
          setWidth(newWidth / 2);
          setWidth2(newWidth / 2);
        } else {
          const currentWidth = width + width2;
          const diff = currentWidth - newWidth;
          setWidth(width + diff / 2);
          setWidth2(width2 + diff / 2);
        }
      }
    }, 100, { leading: true }),
  });
  const syncState = useRef({
    scrollTop1: 0,
    scrollLeft1: 0,
    scrollTop2: 0,
    scrollLeft2: 0,
    currentScrollContainer: null,
    topOverflow1: 0,
    topOverflow2: 0,
    page1: 1,
    page2: 1,
  });
  const rootContainerRef = useRef();
  const resizeOberver = useRef(new ResizeObserver(funcRefs.current.resizeObserverFunc));
  const removeHandlersRef = useRef();
  const readyDefaultState = { 1: false, 2: false, viewer: false, eventFired: false };
  const readyState = useRef(readyDefaultState);

  const [
    isMultiViewerMode,
    isComparisonDisabled,
    activeDocumentViewerKey,
    leftPanelWidth,
    isLeftPanelOpen,
    documentContainerWidth,
    documentContentContainerWidthStyle,
    zoom,
    zoom2,
    activeToolbarGroup,
    activeToolName,
    customMultiViewerSyncHandler,
    syncViewer,
  ] = useSelector((state) => [
    selectors.isMultiViewerMode(state),
    selectors.isComparisonDisabled(state),
    selectors.getActiveDocumentViewerKey(state),
    selectors.getLeftPanelWidthWithResizeBar(state),
    selectors.isElementOpen(state, 'leftPanel'),
    selectors.getDocumentContainerWidth(state),
    selectors.getDocumentContentContainerWidthStyle(state),
    selectors.getZoom(state, 1),
    selectors.getZoom(state, 2),
    selectors.getCurrentToolbarGroup(state),
    selectors.getActiveToolName(state),
    selectors.getCustomMultiViewerSyncHandler(state),
    selectors.getSyncViewer(state),
  ]);

  useEffect(() => {
    const setupMultiViewer = () => {
      if (DISABLED_TOOL_GROUPS.includes(activeToolbarGroup)) {
        dispatch(actions.setToolbarGroup('toolbarGroup-View', false));
      }
      for (const keyWord of DISABLED_TOOLS_KEYWORDS) {
        if (activeToolName.match(keyWord)) {
          core.setToolMode(window.Core.Tools.ToolNames.EDIT);
        }
      }
      const isDoc1Loaded = !!core.getDocumentViewer(1).getDocument();
      setDoc1Loaded(isDoc1Loaded);
      addDocumentViewer(2);
      syncDocumentViewers(1, 2);
      const { addEventHandlers, removeEventHandlers } = eventHandler(store, 2, true);
      removeHandlersRef.current = removeEventHandlers;
      addEventHandlers();
      const width = rootContainerRef.current.clientWidth;
      setWidth(width / 2);
      setWidth2(width / 2);
      resizeOberver.current.observe(rootContainerRef.current);
      !isComparisonDisabled && addHeaderItems();
      setInitialSetup(true);
      onReady('viewer');
    };
    const cleanUpMultiViewer = () => {
      stopSyncing();
      setInitialSetup(false);
      if (activeDocumentViewerKey === 2) {
        setActiveDocumentViewerKey(1);
      }
      setDoc2Loaded(false);
      removeHandlersRef.current();
      removeDocumentViewer(2);
      core.deleteAnnotations(core.getSemanticDiffAnnotations(1), { force: true }, 1);
      resizeOberver.current.disconnect();
      !isComparisonDisabled && resetHeaderItems();
      readyState.current = readyDefaultState;
      dispatch(actions.closeElement('comparePanel'));
    };
    const addHeaderItems = () => {
      const headerItems = selectors.getDefaultHeaderItems(store.getState());
      const zoomOverlay = headerItems.find((item) => item.dataElement === 'zoomOverlayButton');
      const index = headerItems.indexOf(zoomOverlay);
      if (index !== -1) {
        oldHeaderItems.current = {
          zoomOverlay,
          index,
        };
        headerItems.splice(index, 1, {
          type: 'customElement',
          render: () => <ComparisonButton/>,
          dataElement: 'comparisonToggleButton',
          hiddenOnMobileDevices: true,
        });
      }
      if (!headerItems.find((item) => item.dataElement === 'comparePanelToggleButton')) {
        headerItems.splice(headerItems.length - 3, 0, {
          dataElement: 'comparePanelToggleButton',
          hiddenOnMobileDevices: true,
          img: 'icon-header-compare',
          type: 'toggleElementButton',
          element: 'comparePanel',
          title: 'component.comparePanel',
          hidden: ['small-mobile'],
        });
      }
      dispatch(actions.setHeaderItems('default', [...headerItems]));
      dispatch(actions.disableElement('comparePanelToggleButton'));
    };
    const resetHeaderItems = () => {
      const headerItems = selectors.getDefaultHeaderItems(store.getState());
      const index = oldHeaderItems.current.index;
      if (index !== -1) {
        headerItems.splice(index, 1, oldHeaderItems.current.zoomOverlay);
        oldHeaderItems.current = {
          index: null,
          zoomOverlay: null,
        };
      }
      const indexOfButton = headerItems.indexOf(headerItems.find((item) => item.dataElement === 'comparePanelToggleButton'));
      indexOfButton !== -1 && headerItems.splice(indexOfButton, 1);
      dispatch(actions.setHeaderItems('default', [...headerItems]));
    };
    const removeListeners = () => {
      core.removeEventListener('documentLoaded', onLoaded1, 1);
      core.removeEventListener('documentUnloaded', unLoaded1, 1);
      const hasSecondViewer = !!core.getDocumentViewer(2);
      if (hasSecondViewer) {
        core.removeEventListener('documentLoaded', onLoaded2, 2);
        core.removeEventListener('documentUnloaded', unLoaded2, 2);
      }
    };
    const addEventListeners = () => {
      core.addEventListener('documentLoaded', onLoaded1, undefined, 1);
      core.addEventListener('documentUnloaded', unLoaded1, undefined, 1);
      core.addEventListener('documentUnloaded', unLoaded2, undefined, 2);
      core.addEventListener('documentLoaded', onLoaded2, undefined, 2);
    };
    const onLoaded1 = () => {
      setDoc1Loaded(true);
    };
    const onLoaded2 = () => {
      setDoc2Loaded(true);
    };
    const unLoaded1 = () => {
      stopSyncing();
      setDoc1Loaded(false);
      core.deleteAnnotations(core.getSemanticDiffAnnotations(2), { force: true }, 2);
    };
    const unLoaded2 = () => {
      stopSyncing();
      setDoc2Loaded(false);
      core.deleteAnnotations(core.getSemanticDiffAnnotations(1), { force: true }, 1);
    };
    if (!isMultiViewerMode) {
      if (initialSetup) {
        cleanUpMultiViewer();
        return removeListeners;
      }
      return;
    }
    if (!initialSetup) {
      setupMultiViewer();
    }
    addEventListeners();
    return removeListeners;
  }, [isMultiViewerMode]);

  useEffect(() => {
    if (isMultiViewerMode && initialSetup) {
      funcRefs.current.updateScrollView();
    }
  }, [width, width2]);

  useEffect(() => {
    if (initialSetup && isMultiViewerMode) {
      onReady('viewer');
    }
  }, [initialSetup]);

  const setActiveDocumentViewerKey = (documentViewerKey) => {
    dispatch(actions.setActiveDocumentViewerKey(documentViewerKey));
  };
  const updateActiveDocumentViewerKey = (documentViewerKey) => {
    const docLoaded = documentViewerKey === 1 ? doc1Loaded : doc2Loaded;
    docLoaded && activeDocumentViewerKey !== documentViewerKey && setActiveDocumentViewerKey(documentViewerKey);
  };
  const setFirstViewerActive = () => updateActiveDocumentViewerKey(1);
  const setSecondViewerActive = () => updateActiveDocumentViewerKey(2);

  const shouldSkipSyncEvent = () => {
    const state = store.getState();
    return core.getDocumentViewers().length < 2 || !core.getDocument(1) || !core.getDocument(2) ||
    !selectors.isMultiViewerMode(state) || !selectors.getSyncViewer(state);
  };
  const createOnScrollHandler = (documentViewerKey) => (e) => {
    if (shouldSkipSyncEvent()) {
      return;
    }
    const otherViewerNumber = documentViewerKey === 1 ? 2 : 1;
    const { scrollTop, scrollLeft } = e.target;
    if (syncState.current.currentScrollContainer !== otherViewerNumber) {
      const diffTop = scrollTop - syncState.current[`scrollTop${documentViewerKey}`];
      const diffLeft = scrollLeft - syncState.current[`scrollLeft${documentViewerKey}`];
      const otherContainer = otherViewerNumber === 1 ? container : container2;
      const topOverflow = otherContainer.current.scrollTop + diffTop;
      const bottomOverflow = otherContainer.current.scrollHeight - otherContainer.current.scrollTop - diffTop - otherContainer.current.clientHeight;
      if (topOverflow < 0) {
        syncState.current[`topOverflow${otherViewerNumber}`] += topOverflow;
        otherContainer.current.scrollTop += diffTop;
      } else if (bottomOverflow < 0) {
        syncState.current[`topOverflow${otherViewerNumber}`] -= bottomOverflow;
        otherContainer.current.scrollTop += diffTop;
      } else {
        const isTopOverflowPositive = syncState.current[`topOverflow${otherViewerNumber}`] > 0;
        const isDiffTopPositive = diffTop > 0;
        const isZero = diffTop === 0 || syncState.current[`topOverflow${otherViewerNumber}`] === 0;
        if (isDiffTopPositive !== isTopOverflowPositive && !isZero) {
          syncState.current[`topOverflow${otherViewerNumber}`] += diffTop;
          if (syncState.current[`topOverflow${otherViewerNumber}`] > 0 !== isTopOverflowPositive) {
            otherContainer.current.scrollTop += syncState.current[`topOverflow${otherViewerNumber}`];
            syncState.current[`topOverflow${otherViewerNumber}`] = 0;
          }
        } else {
          otherContainer.current.scrollTop += diffTop - syncState.current[`topOverflow${documentViewerKey}`];
          syncState.current[`topOverflow${documentViewerKey}`] = 0;
          otherContainer.current.scrollLeft += diffLeft;
        }
      }
      syncState.current.currentScrollContainer = documentViewerKey;
    } else {
      syncState.current.currentScrollContainer = null;
    }
    syncState.current[`scrollTop${documentViewerKey}`] = scrollTop;
    syncState.current[`scrollLeft${documentViewerKey}`] = scrollLeft;
  };
  const onZoomHandler = (zoomLevel) => {
    if (shouldSkipSyncEvent()) {
      return;
    }
    for (const documentViewerKey of documentViewerKeys) {
      if (core.getZoom(documentViewerKey) !== zoomLevel) {
        zoomTo(zoomLevel, isMultiViewerMode, documentViewerKey);
      }
      const containerRef = (documentViewerKey === 1 ? container : container2).current;
      syncState.current[`scrollTop${documentViewerKey}`] = containerRef.scrollTop;
      syncState.current[`scrollLeft${documentViewerKey}`] = containerRef.scrollLeft;
    }
  };
  const createOnPageUpdateHandler = (documentViewerKey) => (nextPage) => {
    if (shouldSkipSyncEvent()) {
      return;
    }
    const otherViewerNumber = documentViewerKey === 1 ? 2 : 1;
    if (syncState.current.currentScrollContainer !== otherViewerNumber) {
      syncState.current.currentScrollContainer = documentViewerKey;
      const diff = nextPage - syncState.current[`page${documentViewerKey}`];
      const newPage2 = core.getCurrentPage(otherViewerNumber) + diff;
      core.setCurrentPage(newPage2, otherViewerNumber);
    } else {
      syncState.current.currentScrollContainer = null;
    }
    syncState.current[`page${documentViewerKey}`] = nextPage;
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
      core.addEventListener('zoomUpdated', onZoomHandler, undefined, documentViewerKey);
      removeHandlerFunctions.current.push(() => core.removeEventListener('zoomUpdated', onZoomHandler, documentViewerKey));
      if (isScrollable) {
        const onScrollHandler = createOnScrollHandler(documentViewerKey);
        const containerRef = documentViewerKey === 1 ? container.current : container2.current;
        containerRef.addEventListener('scroll', onScrollHandler);
        removeHandlerFunctions.current.push(() => containerRef.removeEventListener('scroll', onScrollHandler));
      } else {
        const onPageUpdatedHandler = createOnPageUpdateHandler(documentViewerKey);
        core.addEventListener('pageNumberUpdated', onPageUpdatedHandler, undefined, documentViewerKey);
        removeHandlerFunctions.current.push(() => core.removeEventListener('pageNumberUpdated', onPageUpdatedHandler, documentViewerKey));
      }
    }
    syncState.current = {
      scrollTop1: container.current.scrollTop,
      scrollLeft1: container.current.scrollLeft,
      scrollTop2: container2.current.scrollTop,
      scrollLeft2: container2.current.scrollLeft,
      topOverflow1: 0,
      topOverflow2: 0,
      page1: core.getCurrentPage(1),
      page2: core.getCurrentPage(2),
      currentScrollContainer: null,
    };

    if (customMultiViewerSyncHandler) {
      customMultiViewerSyncHandler(primaryDocumentViewerKey, removeHandlerFunctions.current);
    }
  };
  const stopSyncing = () => {
    setIsSyncing(false);
    syncState.current.topOverflow1 = 0;
    syncState.current.topOverflow2 = 0;
    removeHandlerFunctions.current.forEach((removeHandler) => removeHandler());
    removeHandlerFunctions.current = [];
  };

  useEffect(() => {
    if (syncViewer && !isSyncing) {
      startSyncing(syncViewer);
    } else if (!syncViewer && isSyncing) {
      stopSyncing();
    }
  }, [syncViewer]);

  const onReady = (key) => {
    readyState.current[key] = true;
    if (readyState.current[1] && readyState.current[2] && readyState.current.viewer && !readyState.current.eventFired) {
      readyState.current.eventFired = true;
      // Fix for event not firing on some devices
      setTimeout(() => {
        fireEvent(Events.MULTI_VIEWER_READY);
      }, 300);
    }
  };

  return (
    <div className={classNames('MultiViewer', { hidden: !isMultiViewerMode })} style={{
      width: documentContentContainerWidthStyle,
      marginLeft: `${isLeftPanelOpen ? leftPanelWidth : 0}px`,
    }}
    ref={rootContainerRef}
    >
      {isMultiViewerMode && initialSetup && <>
        <div className={classNames('CompareContainer', { active: activeDocumentViewerKey === 1 })} id="container1"
          style={{ padding: !doc1Loaded ? '16px' : '0', width }}
          onClick={setFirstViewerActive}
          onScroll={() => !isSyncing && setFirstViewerActive()}
        >
          {!doc1Loaded && <DropArea documentViewerKey={1} />}
          <DocumentHeader documentViewerKey={1} docLoaded={doc1Loaded} isSyncing={isSyncing}/>
          <DocumentContainer container={container} activeDocumentViewerKey={activeDocumentViewerKey} documentViewerKey={1} onReady={onReady} />
          <div className={'custom-container-1'} style={{ width: '100%' }}/>
          <div style={{ width }} className={classNames('borderLineBottom', { active: activeDocumentViewerKey === 1 })} />
        </div>
        <ResizeBar
          dataElement="compareResizeBar"
          minWidth={MIN_WIDTH}
          onResize={(_width) => {
            let maxAllowedWidth = documentContainerWidth;
            maxAllowedWidth -= MIN_WIDTH;
            const minValue = Math.min(_width, maxAllowedWidth);
            setWidth(minValue);
            setWidth2(documentContainerWidth - minValue);
          }}
        />
        <div className={classNames('CompareContainer', { active: activeDocumentViewerKey === 2 })} id="container2"
          style={{ padding: !doc2Loaded ? '16px' : '0', width: width2 }}
          onClick={setSecondViewerActive}
          onScroll={() => !isSyncing && setSecondViewerActive()}
        >
          {!doc2Loaded && <DropArea documentViewerKey={2} />}
          <DocumentHeader documentViewerKey={2} docLoaded={doc2Loaded} isSyncing={isSyncing} />
          <DocumentContainer container={container2} activeDocumentViewerKey={activeDocumentViewerKey} documentViewerKey={2} onReady={onReady}/>
          <div className={'custom-container-2'} style={{ width: '100%' }}/>
          <div style={{ width: width2 }} className={classNames('borderLineBottom', { active: activeDocumentViewerKey === 2 })} />
        </div>
        <CompareZoomOverlay zoom1={zoom} zoom2={zoom2} />
      </>}
    </div>
  );
};

export default MultiViewer;
