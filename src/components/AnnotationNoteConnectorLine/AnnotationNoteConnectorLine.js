import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import { createPortal } from 'react-dom';
import { RESIZE_BAR_WIDTH } from 'constants/panel';
import { getAnnotationPosition } from 'helpers/getPopupPosition';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';
import PropTypes from 'prop-types';
import {
  calculateHorizontalDistanceToAnnotation,
  calculateRightHorizontalLineProperties,
  calculateLeftHorizontalLineProperties,
  calculateMiddleVerticalLineProperties,
} from 'helpers/annotationNoteConnectorLineHelper';

import './AnnotationNoteConnectorLine.scss';

const LineConnectorPortal = ({ children }) => {
  const mount = getRootNode().querySelector('#line-connector-root');
  const el = document.createElement('div');
  el.setAttribute('data-element', DataElements.ANNOTATION_NOTE_CONNECTOR_LINE);

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
};

const propTypes = {
  annotation: PropTypes.object,
  noteContainerRef: PropTypes.object,
  isCustomPanelOpen: PropTypes.bool,
};

const AnnotationNoteConnectorLine = ({ annotation, noteContainerRef, isCustomPanelOpen }) => {
  const [
    isCustomUIEnabled,
    topHeadersHeight,
    bottomHeadersHeight,
    notePanelWidth,
    lineIsOpen,
    notePanelIsOpen,
    isLineDisabled,
    documentContainerWidth,
    documentContainerHeight,
    activeDocumentViewerKey,
  ] = useSelector(
    (state) => [
      selectors.getIsCustomUIEnabled(state),
      selectors.getTopHeadersHeight(state),
      selectors.getBottomHeadersHeight(state),
      selectors.getNotesPanelWidth(state),
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

  // Right Horizontal Line
  const [rightHorizontalLineWidth, setRightHorizontalLineWidth] = useState(0);
  const [rightHorizontalLineTop, setRightHorizontalLineTop] = useState(0);
  const [rightHorizontalLineRight, setRightHorizontalLineRight] = useState(0);

  // Left Horizontal Line
  const [leftHorizontalLineWidth, setLeftHorizontalLineWidth] = useState(0);
  const [leftHorizontalLineTop, setLeftHorizontalLineTop] = useState(0);
  const [leftHorizontalLineRight, setLeftHorizontalLineRight] = useState(0);

  const notePanelPadding = 16;
  const notesPanelResizeBarWidth = isCustomUIEnabled ? RESIZE_BAR_WIDTH : 0;
  // This is the ratio of distance to the annotation that the right horizontal line should cover.
  // Ideally, this is long enough to get away from the edge.
  const rightHorizontalLineWidthRatio = 0.75;

  const {
    bottomRight: annotationBottomRight,
    topLeft: annotationTopLeft
  } = getAnnotationPosition(annotation, activeDocumentViewerKey);

  const getAnnotationLineOffset = useCallback(() => {
    if (annotation.Subject === 'Note') {
      return 4;
    }
    return 15;
  }, [annotation]);

  useEffect(() => {
    const onPageNumberUpdated = () => {
      dispatch(actions.closeElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE));
    };
    core.addEventListener('pageNumberUpdated', onPageNumberUpdated, undefined, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('pageNumberUpdated', onPageNumberUpdated, activeDocumentViewerKey);
    };
  }, []);

  useEffect(() => {
    if (!noteContainerRef || !noteContainerRef.current) {
      return;
    }
    const { scrollTop, scrollLeft } = core.getScrollViewElement(activeDocumentViewerKey);

    const isAnnotationPositionInvalid = !(annotationBottomRight && annotationTopLeft);
    if (isAnnotationPositionInvalid) {
      return () => {
        dispatch(actions.closeElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE));
      };
    }

    const isWebComponent = window.isApryseWebViewerWebComponent;
    const annotationWidth = annotationBottomRight.x - annotationTopLeft.x;

    const viewerWidth = window.isApryseWebViewerWebComponent ? getRootNode().host.clientWidth : window.innerWidth;

    // Calculate the distance between the right of the annotation to the left of the notes panel
    const distanceToAnnotation = calculateHorizontalDistanceToAnnotation({
      viewerWidth,
      annotationXPosition: annotationTopLeft.x,
      annotationWidth,
      notePanelWidth,
      notePanelPadding,
      notesPanelResizeBarWidth,
      scrollLeft,
    });

    const {
      rightHorizontalLineRightOffset,
      rightHorizontalLineTopOffset,
      rightHorizontalLineLength,
    } = calculateRightHorizontalLineProperties({
      notePanelWidth,
      notePanelPadding,
      notesPanelResizeBarWidth,
      notesContainerTop: noteContainerRef.current.getBoundingClientRect().top,
      viewerOffsetTop: isWebComponent ? getRootNode().host.offsetTop : 0,
      distanceToAnnotation,
      lineWidthRatio: rightHorizontalLineWidthRatio,
    });

    setRightHorizontalLineRight(rightHorizontalLineRightOffset);
    setRightHorizontalLineTop(rightHorizontalLineTopOffset);
    setRightHorizontalLineWidth(rightHorizontalLineLength);

    const {
      leftHorizontalLineRightOffset,
      leftHorizontalLineTopOffset,
      leftHorizontalLineLength,
    } = calculateLeftHorizontalLineProperties({
      isAnnotationNoZoom: annotation.NoZoom,
      annotationNoZoomReferencePoint: annotation.getNoZoomReferencePoint(),
      annotationHeight: annotationBottomRight.y - annotationTopLeft.y,
      notePanelWidth,
      notePanelPadding,
      notesPanelResizeBarWidth,
      rightHorizontalLineLength,
      distanceToAnnotation,
      annotationTopLeftY: annotationTopLeft.y,
      scrollTop,
      annotationLineOffset: getAnnotationLineOffset(),
    });

    setLeftHorizontalLineRight(leftHorizontalLineRightOffset);
    setLeftHorizontalLineTop(leftHorizontalLineTopOffset);
    setLeftHorizontalLineWidth(leftHorizontalLineLength);
  }, [
    noteContainerRef,
    notePanelWidth,
    annotationBottomRight,
    annotationTopLeft,
    documentContainerWidth,
    documentContainerHeight,
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

  if (lineIsOpen && (notePanelIsOpen || isCustomPanelOpen) && !isLineDisabled) {
    const { verticalLineTop, verticalLineHeight, isAnnotationOffScreen } = calculateMiddleVerticalLineProperties({
      rightHorizontalLineTop,
      leftHorizontalLineTop,
      bottomHeaderTop:
        (window.isApryseWebViewerWebComponent ? getRootNode().host.clientHeight : window.innerWidth) -
        bottomHeadersHeight,
      topHeadersHeight,
      isCustomUIEnabled,
    });

    return (
      <LineConnectorPortal>
        <div
          className="horizontalLine"
          style={{ width: rightHorizontalLineWidth, right: rightHorizontalLineRight, top: rightHorizontalLineTop }}
        />
        <div
          className="verticalLine"
          style={{
            height: verticalLineHeight,
            top: verticalLineTop,
            right: rightHorizontalLineRight + rightHorizontalLineWidth,
          }}
        />
        <div
          className="horizontalLine"
          style={{
            width: leftHorizontalLineWidth,
            right: leftHorizontalLineRight,
            top: leftHorizontalLineTop,
            visibility: isAnnotationOffScreen ? 'hidden' : 'visible',
          }}
        >
          <div className="arrowHead" />
        </div>
      </LineConnectorPortal>
    );
  }
  return null;
};

AnnotationNoteConnectorLine.propTypes = propTypes;

export default AnnotationNoteConnectorLine;
