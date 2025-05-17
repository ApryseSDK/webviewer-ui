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
import throttle from 'lodash/throttle';
import ComparisonButton from 'components/MultiViewer/ComparisonButton';
import {
  addDocumentViewer,
  syncDocumentViewers,
  removeDocumentViewer,
  setupOpenURLHandler,
} from 'helpers/documentViewerHelper';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import { DISABLED_TOOLS_KEYWORDS, DISABLED_TOOL_GROUPS } from 'constants/multiViewerContants';
import DataElements from 'constants/dataElement';
import multiViewerHelper, { useMultiViewerSync } from 'helpers/multiViewerHelper';

const MIN_WIDTH = 350;

const MultiViewer = () => {
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
      const readyStateCurrent = readyState.current;
      if (readyStateCurrent.viewer) {
        funcRefs.current.updateScrollView();
      }
    }, 100, { leading: true }),
  });
  const rootContainerRef = useRef();
  const resizeOberver = useRef(new ResizeObserver(funcRefs.current.resizeObserverFunc));
  const removeHandlersRef = useRef();
  const readyDefaultState = { 1: false, 2: false, viewer: false, eventFired: false };
  const readyState = useRef(readyDefaultState);

  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const isComparisonDisabled = useSelector(selectors.isComparisonDisabled);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const documentContainerWidth = useSelector(selectors.getDocumentContainerWidth);
  const documentContentContainerWidthStyle = useSelector(selectors.getDocumentContentContainerWidthStyle);
  const zoom = useSelector((state) => selectors.getZoom(state, 1));
  const zoom2 = useSelector((state) => selectors.getZoom(state, 2));
  const activeToolbarGroup = useSelector(selectors.getCurrentToolbarGroup);
  const activeToolName = useSelector(selectors.getActiveToolName);
  const documentContainerLeftMargin = useSelector(selectors.getDocumentContainerLeftMargin);
  const isShowComparisonButtonEnabled = useSelector(selectors.getIsShowComparisonButtonEnabled);

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
      const newDocViewer = core.getDocumentViewers()[1];
      setupOpenURLHandler(newDocViewer, store);

      syncDocumentViewers(1, 2);
      const { addEventHandlers, removeEventHandlers } = eventHandler(store, 2, true);
      removeHandlersRef.current = removeEventHandlers;
      addEventHandlers();
      const width = rootContainerRef.current.clientWidth;
      setWidth(width / 2);
      setWidth2(width / 2);
      resizeOberver.current.observe(rootContainerRef.current);
      !isComparisonDisabled && isShowComparisonButtonEnabled && addHeaderItems();
      setInitialSetup(true);
      onReady('viewer');
      dispatch(actions.setIsMultiViewerReady(true));
    };
    const cleanUpMultiViewer = () => {
      dispatch(actions.setIsMultiViewerReady(false));
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
      const zoomOverlay = headerItems.find((item) => item.dataElement === DataElements.ZOOM_OVERLAY_BUTTON);
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
      if (index && index !== -1) {
        headerItems.splice(index, 1, oldHeaderItems.current.zoomOverlay);
        oldHeaderItems.current = {
          index: null,
          zoomOverlay: null,
        };
      }
      const indexOfButton = headerItems.indexOf(headerItems.find((item) => item?.dataElement === 'comparePanelToggleButton'));
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
      multiViewerHelper.matchedPages = null;
      core.deleteAnnotations(core.getSemanticDiffAnnotations(2), { force: true }, 2);
    };
    const unLoaded2 = () => {
      stopSyncing();
      setDoc2Loaded(false);
      multiViewerHelper.matchedPages = null;
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

    if (isMultiViewerMode && isShowComparisonButtonEnabled && initialSetup) {
      addHeaderItems();
    } else if (initialSetup) {
      resetHeaderItems();
    }

    addEventListeners();
    return removeListeners;
  }, [isMultiViewerMode, isShowComparisonButtonEnabled]);

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

  const { stopSyncing, isSyncing } = useMultiViewerSync(container, container2);

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
      marginLeft: `${documentContainerLeftMargin}px`,
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
          <DocumentContainer container={container} activeDocumentViewerKey={activeDocumentViewerKey} documentViewerKey={1} onReady={onReady} docLoaded={doc1Loaded}/>
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
          <DocumentContainer container={container2} activeDocumentViewerKey={activeDocumentViewerKey} documentViewerKey={2} onReady={onReady} docLoaded={doc2Loaded}/>
          <div className={'custom-container-2'} style={{ width: '100%' }}/>
          <div style={{ width: width2 }} className={classNames('borderLineBottom', { active: activeDocumentViewerKey === 2 })} />
        </div>
        <CompareZoomOverlay zoom1={zoom} zoom2={zoom2} />
      </>}
    </div>
  );
};

export default MultiViewer;