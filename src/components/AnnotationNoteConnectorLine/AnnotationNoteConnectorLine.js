import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import useCore from 'hooks/useCore';
import selectors from 'selectors';
import actions from 'actions';
import { createPortal } from 'react-dom';
import { getAnnotationPosition } from 'helpers/getPopupPosition';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';
import PropTypes from 'prop-types';
import { getConnectorLines } from 'helpers/annotationNoteConnectorLineHelper';
import classNames from 'classnames';

import './AnnotationNoteConnectorLine.scss';
import debounce from 'lodash/debounce';

const LineConnectorPortal = ({ children, anchorNode }) => {
  // Resolve the mount target from a node that's already in this instance's React tree (anchorNode), using the DOM-level Node.getRootNode() so we get the local ShadowRoot/Document. The module-level `getRootNode()` helper returns the singleton last-registered root node, which in multi-WC mode points to the most-recently-mounted instance and would cause connector lines from one viewer to render inside another.
  const localRoot = anchorNode?.getRootNode?.() || getRootNode();
  const mount = localRoot.querySelector('#line-connector-root');
  const el = document.createElement('div');
  el.setAttribute('data-element', DataElements.ANNOTATION_NOTE_CONNECTOR_LINE);

  useEffect(() => {
    if (!mount) {
      return undefined;
    }
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);

  if (!mount) {
    return null;
  }
  return createPortal(children, el);
};

const propTypes = {
  annotation: PropTypes.object,
  noteContainerRef: PropTypes.object,
  isCustomPanelOpen: PropTypes.bool,
};

const AnnotationNoteConnectorLine = ({ annotation, noteContainerRef, isCustomPanelOpen }) => {
  const { core } = useCore();
  const [
    topHeadersHeight,
    bottomHeadersHeight,
    lineIsOpen,
    notePanelIsOpen,
    isLineDisabled,
    documentContainerWidth,
    documentContainerHeight,
    activeDocumentViewerKey,
  ] = useSelector(
    (state) => [
      selectors.getTopHeadersHeight(state),
      selectors.getBottomHeadersHeight(state),
      selectors.isElementOpen(state, DataElements.ANNOTATION_NOTE_CONNECTOR_LINE),
      selectors.isElementOpen(state, DataElements.NOTES_PANEL),
      selectors.isElementDisabled(state, DataElements.ANNOTATION_NOTE_CONNECTOR_LINE),
      selectors.getDocumentContainerWidth(state),
      selectors.getDocumentContainerHeight(state),
      selectors.getActiveDocumentViewerKey(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();
  const [lineProperties, setLineProperties] = useState();

  useEffect(() => {
    const onPageNumberUpdated = () => {
      dispatch(actions.closeElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE));
    };
    core.addEventListener('pageNumberUpdated', onPageNumberUpdated, undefined, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('pageNumberUpdated', onPageNumberUpdated, activeDocumentViewerKey);
    };
  }, []);

  const scrollViewElement = core.getScrollViewElement(activeDocumentViewerKey);

  const calculatePosition = debounce(({
    activeDocumentViewerKey,
    bottomHeadersHeight,
    topHeadersHeight,
  }) => {
    const {
      bottomRight: annotationBottomRight,
      topLeft: annotationTopLeft
    } = getAnnotationPosition(annotation, activeDocumentViewerKey);
    if (!noteContainerRef || !noteContainerRef.current) {
      return;
    }
    const isAnnotationPositionInvalid = !(annotationBottomRight && annotationTopLeft);
    if (isAnnotationPositionInvalid) {
      return () => {
        dispatch(actions.closeElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE));
      };
    }
    const newLines = getConnectorLines({
      annotationTopLeft,
      annotationBottomRight,
      noteContainerRef,
      bottomHeadersHeight,
      topHeadersHeight,
      activeDocumentViewerKey,
      // Resolve the local shadow root from a node already in this React tree so the helper computes coordinates against THIS instance's `#app`, not whichever instance the singleton currently points at.
      rootNodeOverride: noteContainerRef.current.getRootNode?.(),
    });
    setLineProperties(newLines);
  }, 100, { leading: true, trailing: true });


  const {
    bottomRight: annotationBottomRight,
    topLeft: annotationTopLeft
  } = getAnnotationPosition(annotation, activeDocumentViewerKey);
  const annotDeps = [
    annotationBottomRight?.x,
    annotationBottomRight?.y,
    annotationTopLeft?.x,
    annotationTopLeft?.y,
  ];
  const scrollViewDeps = [
    scrollViewElement,
    scrollViewElement?.scrollTop,
    scrollViewElement?.scrollLeft,
  ];
  const documentAndHeaderDeps = [
    documentContainerWidth,
    documentContainerHeight,
    activeDocumentViewerKey,
    bottomHeadersHeight,
    topHeadersHeight,
  ];
  const noteContainerRect = noteContainerRef?.current?.getBoundingClientRect();
  const positionAndSizeDeps = [
    noteContainerRect?.top,
    noteContainerRect?.left,
    noteContainerRect?.right,
    noteContainerRect?.bottom,
  ];
  useEffect(() => {
    calculatePosition({
      activeDocumentViewerKey,
      bottomHeadersHeight,
      topHeadersHeight,
    });
  }, [
    ...positionAndSizeDeps,
    ...annotDeps,
    ...scrollViewDeps,
    ...documentAndHeaderDeps,
  ]);

  useEffect(() => {
    const onPageNumberUpdated = () => {
      dispatch(actions.closeElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE));
    };

    core.addEventListener('pageNumberUpdated', onPageNumberUpdated, undefined, activeDocumentViewerKey);

    return () => {
      core.removeEventListener('pageNumberUpdated', onPageNumberUpdated, activeDocumentViewerKey);
    };
  }, [
    dispatch,
    activeDocumentViewerKey,
  ]);

  if (lineIsOpen && (notePanelIsOpen || isCustomPanelOpen) && !isLineDisabled && lineProperties) {
    const {
      topLineStyle,
      verticalLineStyle,
      bottomLineStyle,
      isPanelOnLeft,
    } = lineProperties;
    return (
      <LineConnectorPortal anchorNode={noteContainerRef?.current}>
        <div className="horizontalLine" css={topLineStyle}/>
        <div className="verticalLine" css={verticalLineStyle}/>
        <div className="horizontalLine" css={bottomLineStyle}>
          <div className={classNames('arrowHead', { 'arrow-right': isPanelOnLeft })} />
        </div>
      </LineConnectorPortal>
    );
  }
  return null;
};

AnnotationNoteConnectorLine.propTypes = propTypes;

export default AnnotationNoteConnectorLine;
