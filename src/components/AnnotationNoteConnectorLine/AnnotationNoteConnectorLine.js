import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import { createPortal } from 'react-dom';
import { getAnnotationPosition } from '../../helpers/getPopupPosition';

import './AnnotationNoteConnectorLine.scss';

const LineConnectorPortal = ({ children }) => {
  const mount = document.getElementById("line-connector-root");
  const el = document.createElement("div");
  el.setAttribute('data-element', 'annotationNoteConnectorLine');

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
};

const AnnotationNoteConnectorLine = ({ annotation, noteContainerRef }) => {
  const [notePanelWidth, lineIsOpen, notePanelIsOpen, isLineDisabled, documentContainerWidth, documentContainerHeight] = useSelector(
    state => [
      selectors.getNotesPanelWidth(state),
      selectors.isElementOpen(state, 'annotationNoteConnectorLine'),
      selectors.isElementOpen(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'annotationNoteConnectorLine'),
      selectors.getDocumentContainerWidth(state),
      selectors.getDocumentContainerHeight(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();

  //Right Horizontal Line
  const [rightHorizontalLineWidth, setRightHorizontalLineWidth] = useState(0);
  const [rightHorizontalLineTop, setRightHorizontalLineTop] = useState(0);
  const [rightHorizontalLineRight, setRightHorizontalLineRight] = useState(0);

  //Left Horizontal Line
  const [leftHorizontalLineWidth, setLeftHorizontalLineWidth] = useState(0);
  const [leftHorizontalLineTop, setLeftHorizontalLineTop] = useState(0);
  const [leftHorizontalLineRight, setLeftHorizontalLineRight] = useState(0);

  const { bottomRight: annotationBottomRight, topLeft: annotationTopLeft } = getAnnotationPosition(annotation);

  const getAnnotationLineOffset = useCallback(() => {
    if (annotation.Subject === 'Note') {
      return 4;
    }
    return 15;
  }, [annotation]);

  useEffect(() => {
    const { scrollTop, scrollLeft } = core.getScrollViewElement();
    const notePanelLeftPadding = 16;

    const annotWidthInPixels = annotationBottomRight.x - annotationTopLeft.x;
    const annotHeightInPixels = annotationBottomRight.y - annotationTopLeft.y;

    setRightHorizontalLineRight(notePanelWidth - notePanelLeftPadding);
    setRightHorizontalLineTop(noteContainerRef.current.getBoundingClientRect().top);

    const lineWidth = window.innerWidth - notePanelWidth - annotationTopLeft.x + notePanelLeftPadding + scrollLeft - annotWidthInPixels;
    const rightHorizontalLineWidthRatio = 0.75;
    setRightHorizontalLineWidth(lineWidth * rightHorizontalLineWidthRatio);
    setLeftHorizontalLineWidth(lineWidth - rightHorizontalLineWidth - getAnnotationLineOffset());

    setLeftHorizontalLineRight(notePanelWidth - notePanelLeftPadding + rightHorizontalLineWidth);

    setLeftHorizontalLineTop(annotationTopLeft.y + (annotHeightInPixels / 2) - scrollTop);

    const onPageNumberUpdated = () => {
      dispatch(actions.closeElement('annotationNoteConnectorLine'))
    }

    core.addEventListener('pageNumberUpdated', onPageNumberUpdated);

    return () => {
      core.removeEventListener('pageNumberUpdated', onPageNumberUpdated);
    };

  }, [noteContainerRef, notePanelWidth, annotationBottomRight, annotationTopLeft, documentContainerWidth, documentContainerHeight, dispatch]);

  if (lineIsOpen && notePanelIsOpen && !isLineDisabled) {
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
  } else {
    return null;
  }
};

export default AnnotationNoteConnectorLine;