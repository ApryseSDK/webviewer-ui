import React, { useEffect, useRef, useState } from 'react';
import './MultiViewer.scss';
import selectors from 'selectors';
import actions from 'actions';
import useCore from 'hooks/useCore';
import useIsRTL from 'hooks/useIsRTL';
import { useSelector, useDispatch } from 'react-redux';
import DropArea from 'components/MultiViewer/DropArea';
import ResizeBar from 'components/ResizeBar';
import DocumentHeader from 'components/MultiViewer/DocumentHeader';
import DocumentContainer from 'components/MultiViewer/DocumentContainer';
import classNames from 'classnames';
import CompareZoomOverlay from 'components/MultiViewer/CompareZoomOverlay';
import throttle from 'lodash/throttle';
import fireActiveDocumentViewerChanged from 'helpers/fireActiveDocumentViewerChanged';
import multiViewerHelper, { useMultiViewerSync } from 'helpers/multiViewerHelper';
import { getLogicalMargins } from 'src/helpers/documentContainerHelper';

const MIN_WIDTH = 350;

const MultiViewer = () => {
  const { core: coreLeftViewer } = useCore(1);
  const { core: coreRightViewer } = useCore(2);
  const isRTL = useIsRTL();
  const dispatch = useDispatch();
  const [initialSetup, setInitialSetup] = useState(false);
  const container = useRef();
  const container2 = useRef();
  const doc1Loaded = useSelector((state) => selectors.isDocumentLoaded(state, 1));
  const doc2Loaded = useSelector((state) => selectors.isDocumentLoaded(state, 2));
  const canSync = doc1Loaded && doc2Loaded;
  const [width, setWidth] = useState(0);
  const [width2, setWidth2] = useState(0);
  const funcRefs = useRef({
    updateScrollView: throttle(() => {
      coreLeftViewer.scrollViewUpdated();
      coreRightViewer.scrollViewUpdated();
    }, 100, { leading: true }),
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
      funcRefs.current.updateScrollView();
    }, 100, { leading: true }),
  });
  const rootContainerRef = useRef();
  const resizeObserver = useRef(new ResizeObserver(funcRefs.current.resizeObserverFunc));

  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const documentContainerWidth = useSelector(selectors.getDocumentContainerWidth);
  const documentContentContainerWidthStyle = useSelector(selectors.getDocumentContentContainerWidthStyle);
  const zoom = useSelector((state) => selectors.getZoom(state, 1));
  const zoom2 = useSelector((state) => selectors.getZoom(state, 2));
  const documentContainerLeftMargin = useSelector(selectors.getDocumentContainerLeftMargin);
  const documentContainerRightMargin = useSelector(selectors.getDocumentContainerRightMargin);
  const { startMargin, endMargin } = getLogicalMargins(
    isRTL,
    documentContainerLeftMargin,
    documentContainerRightMargin,
  );

  useEffect(() => {
    const setup = () => {
      setInitialSetup(true);
      const width = rootContainerRef.current.clientWidth;
      setWidth(width / 2);
      setWidth2(width / 2);
      resizeObserver.current.observe(rootContainerRef.current);
    };
    const cleanUp = () => {
      stopSyncing();
      setInitialSetup(false);
      resizeObserver.current.disconnect();
    };
    const removeListeners = () => {
      coreLeftViewer.removeEventListener('documentUnloaded', unLoaded1);
      const hasSecondViewer = !!coreRightViewer.getDocumentViewer();
      if (hasSecondViewer) {
        coreRightViewer.removeEventListener('documentUnloaded', unLoaded2);
      }
    };
    const unLoaded1 = () => {
      dispatch(actions.setSyncViewer(null));
      stopSyncing();
      multiViewerHelper.matchedPages = null;
      coreRightViewer.deleteAnnotations(coreRightViewer.getSemanticDiffAnnotations(), { force: true });
    };
    const unLoaded2 = () => {
      dispatch(actions.setSyncViewer(null));
      stopSyncing();
      multiViewerHelper.matchedPages = null;
      coreLeftViewer.deleteAnnotations(coreLeftViewer.getSemanticDiffAnnotations(), { force: true });
    };
    if (!isMultiViewerMode) {
      if (initialSetup) {
        cleanUp();
        return removeListeners;
      }
      return;
    }
    if (!initialSetup) {
      setup();
      coreLeftViewer.addEventListener('documentUnloaded', unLoaded1, undefined);
      coreRightViewer.addEventListener('documentUnloaded', unLoaded2, undefined);
    }
    return removeListeners;
  }, [isMultiViewerMode]);

  useEffect(() => {
    if (isMultiViewerMode && initialSetup) {
      funcRefs.current.updateScrollView();
    }
  }, [width, width2]);

  const setActiveDocumentViewerKey = (documentViewerKey) => {
    const previousDocumentViewerKey = activeDocumentViewerKey;
    dispatch(actions.setActiveDocumentViewerKey(documentViewerKey));
    if (previousDocumentViewerKey !== documentViewerKey) {
      fireActiveDocumentViewerChanged(previousDocumentViewerKey, documentViewerKey);
    }
  };

  const updateActiveDocumentViewerKey = (documentViewerKey) => {
    const docLoaded = documentViewerKey === 1 ? doc1Loaded : doc2Loaded;
    docLoaded && activeDocumentViewerKey !== documentViewerKey && setActiveDocumentViewerKey(documentViewerKey);
  };
  const setFirstViewerActive = () => updateActiveDocumentViewerKey(1);
  const setSecondViewerActive = () => updateActiveDocumentViewerKey(2);

  const { stopSyncing, isSyncing } = useMultiViewerSync(container, container2);

  return (
    <div className={classNames('MultiViewer', { hidden: !isMultiViewerMode })} style={{
      width: documentContentContainerWidthStyle,
      marginInlineStart: `${startMargin}px`,
      marginInlineEnd: `${endMargin}px`,
    }}
    ref={rootContainerRef}
    >
      {isMultiViewerMode && <>
        <div className={classNames('CompareContainer', { active: activeDocumentViewerKey === 1 })} id="container1"
          style={{ padding: !doc1Loaded ? '16px' : '0', width }}
          onPointerDownCapture={setFirstViewerActive}
          onMouseDownCapture={setFirstViewerActive}
          onTouchStartCapture={setFirstViewerActive}
          onClick={setFirstViewerActive}
          onWheelCapture={() => !isSyncing && setFirstViewerActive()}
          onScroll={() => !isSyncing && setFirstViewerActive()}
        >
          {!doc1Loaded && <DropArea documentViewerKey={1} />}
          <DocumentHeader documentViewerKey={1} docLoaded={doc1Loaded} isSyncing={isSyncing} canSync={canSync}/>
          <DocumentContainer container={container} activeDocumentViewerKey={activeDocumentViewerKey} documentViewerKey={1} docLoaded={doc1Loaded}/>
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
          onPointerDownCapture={setSecondViewerActive}
          onMouseDownCapture={setSecondViewerActive}
          onTouchStartCapture={setSecondViewerActive}
          onClick={setSecondViewerActive}
          onWheelCapture={() => !isSyncing && setSecondViewerActive()}
          onScroll={() => !isSyncing && setSecondViewerActive()}
        >
          {!doc2Loaded && <DropArea documentViewerKey={2} />}
          <DocumentHeader documentViewerKey={2} docLoaded={doc2Loaded} isSyncing={isSyncing} canSync={canSync}/>
          <DocumentContainer container={container2} activeDocumentViewerKey={activeDocumentViewerKey} documentViewerKey={2} docLoaded={doc2Loaded}/>
          <div className={'custom-container-2'} style={{ width: '100%' }}/>
          <div style={{ width: width2 }} className={classNames('borderLineBottom', { active: activeDocumentViewerKey === 2 })} />
        </div>
        <CompareZoomOverlay zoom1={zoom} zoom2={zoom2} />
      </>}
    </div>
  );
};

export default MultiViewer;
