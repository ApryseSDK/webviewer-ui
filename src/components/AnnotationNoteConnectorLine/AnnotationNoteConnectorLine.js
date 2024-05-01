import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import { createPortal } from 'react-dom';
import { getAnnotationPosition } from 'helpers/getPopupPosition';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';

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

const AnnotationNoteConnectorLine = ({ annotation, noteContainerRef, isCustomPanelOpen }) => {
  const [
    notePanelWidth,
    lineIsOpen,
    notePanelIsOpen,
    isLineDisabled,
    documentContainerWidth,
    documentContainerHeight,
    activeDocumentViewerKey,
  ] = useSelector(
    (state) => [
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
    const { scrollTop, scrollLeft } = core.getScrollViewElement(activeDocumentViewerKey);
    const notePanelLeftPadding = 16;
    const isAnnotationPositionInvalid = !(annotationBottomRight && annotationTopLeft);
    if (isAnnotationPositionInvalid) {
      return () => {
        dispatch(actions.closeElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE));
      };
    }
    const annotWidthInPixels = annotationBottomRight.x - annotationTopLeft.x;
    const annotHeightInPixels = annotationBottomRight.y - annotationTopLeft.y;

    const viewerWidth = window.isApryseWebViewerWebComponent ? getRootNode().host.clientWidth : window.innerWidth;
    const viewerOffsetTop = window.isApryseWebViewerWebComponent ? getRootNode().host.offsetTop : 0;

    setRightHorizontalLineRight(notePanelWidth - notePanelLeftPadding);
    setRightHorizontalLineTop(noteContainerRef.current.getBoundingClientRect().top - viewerOffsetTop);
    const lineWidth = viewerWidth - notePanelWidth - annotationTopLeft.x + notePanelLeftPadding + scrollLeft - annotWidthInPixels;
    const rightHorizontalLineWidthRatio = 0.75;
    setRightHorizontalLineWidth(lineWidth * rightHorizontalLineWidthRatio);
    const noZoomRefPoint = annotation.getNoZoomReferencePoint();
    const noZoomRefShiftX = (annotation.NoZoom && noZoomRefPoint.x) ? noZoomRefPoint.x * annotHeightInPixels : 0;
    setLeftHorizontalLineWidth(lineWidth - rightHorizontalLineWidth - getAnnotationLineOffset() + noZoomRefShiftX);

    setLeftHorizontalLineRight(notePanelWidth - notePanelLeftPadding + rightHorizontalLineWidth);

    const noZoomRefShiftY = (annotation.NoZoom && noZoomRefPoint.y) ? noZoomRefPoint.y * annotHeightInPixels : 0;
    setLeftHorizontalLineTop(annotationTopLeft.y + (annotHeightInPixels / 2) - scrollTop - noZoomRefShiftY);

    const onPageNumberUpdated = () => {
      dispatch(actions.closeElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE));
    };

    core.addEventListener('pageNumberUpdated', onPageNumberUpdated, undefined, activeDocumentViewerKey);

    return () => {
      core.removeEventListener('pageNumberUpdated', onPageNumberUpdated, activeDocumentViewerKey);
    };
  }, [noteContainerRef, notePanelWidth, annotationBottomRight, annotationTopLeft, documentContainerWidth, documentContainerHeight, dispatch, activeDocumentViewerKey]);

  if (lineIsOpen && (notePanelIsOpen || isCustomPanelOpen) && !isLineDisabled) {
    const verticalHeight = Math.abs(rightHorizontalLineTop - leftHorizontalLineTop);
    const horizontalLineHeight = 2;
    // Add HorizontalLineHeight of 2px when annot is above note to prevent little gap between lines
    const verticalTop = rightHorizontalLineTop > leftHorizontalLineTop ? leftHorizontalLineTop + horizontalLineHeight : rightHorizontalLineTop;

    return (
      <LineConnectorPortal>
        <div className="horizontalLine" style={{ width: rightHorizontalLineWidth, right: rightHorizontalLineRight, top: rightHorizontalLineTop }} />
        <div className="verticalLine" style={{ height: verticalHeight, top: verticalTop, right: rightHorizontalLineRight + rightHorizontalLineWidth }} />
        <div className="horizontalLine" style={{ width: leftHorizontalLineWidth, right: leftHorizontalLineRight, top: leftHorizontalLineTop }}>
          <div className="arrowHead" />
        </div>
      </LineConnectorPortal>);
  }
  return null;
};

export default AnnotationNoteConnectorLine;
