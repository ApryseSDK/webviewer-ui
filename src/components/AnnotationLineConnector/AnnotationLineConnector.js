import React, { useEffect, useContext, useState } from 'react';
import NoteContext from 'components/Note/Context';
import { useSelector, shallowEqual } from 'react-redux';
import core from 'core';
import selectors from 'selectors';
import { createPortal } from 'react-dom';

import './AnnotationLineConnector.scss';


const LineConnectorPortal = ({ children }) => {
  const mount = document.getElementById("line-connector-root");
  const el = document.createElement("div");
  el.setAttribute('data-element', 'annotationLineConnector');

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
};


const AnnotationLineConnector = ({ annotation, noteContainerRef }) => {
  const [notePanelWidth, isLineOpen, isNotesPanelOpen] = useSelector(
    state => [
      selectors.getNotesPanelWidth(state),
      selectors.isElementOpen(state, 'annotationLineConnector'),
      selectors.isElementOpen(state, 'notesPanel'),
    ],
    shallowEqual,
  );

  //Horizontal Line One
  const [horizontalLineOneWidth, setHorizontalLineOneWidth] = useState(0);
  const [horizontalLineOneTop, setHorizontalLineOneTop] = useState(0);
  const [horizontalLineOneRight, setHorizontalLineOneRight] = useState(0);

  //Horizontal Line Two
  const [horizontalLineTwoWidth, setHorizontalLineTwoWidth] = useState(0);
  const [horizontalLineTwoTop, setHorizontalLineTwoTop] = useState(0);
  const [horizontalLineTwoRight, setHorizontalLineTwoRight] = useState(0);

  const { isSelected } = useContext(NoteContext);
  const displayMode = core.getDisplayModeObject();
  const annotationWindowCoords  = displayMode.pageToWindow({ x: annotation.getX(), y: annotation.getY() }, annotation.PageNumber);

  useEffect(() => {
    const { x: annotOriginX, y: annotOriginY } = annotationWindowCoords;
    const { scrollTop } = core.getScrollViewElement();
    const notePanelLeftPadding = 16;

    // Annot Width to pixels
    const annotationRightEdgeX = annotation.getX() + annotation.getWidth();
    const annotRigthEdgeCoords = displayMode.pageToWindow({ x: annotationRightEdgeX, y: annotation.getY() }, annotation.PageNumber);
    const annotWidthInPixels = annotRigthEdgeCoords.x - annotOriginX;

    // Annot Height to pixels
    const annotationBottomEdgeY = annotation.getY() + annotation.getHeight();
    const annotBottomEdgeCoords = displayMode.pageToWindow({ x: annotation.getX(), y: annotationBottomEdgeY }, annotation.PageNumber);
    const annotHeightInPixels = annotBottomEdgeCoords.y - annotOriginY;

    setHorizontalLineOneRight(notePanelWidth - notePanelLeftPadding);
    setHorizontalLineOneTop(noteContainerRef.current.getBoundingClientRect().top);

    const lineWidth = window.innerWidth - notePanelWidth - annotOriginX + notePanelLeftPadding;
    const firstSegmentRatio = 0.75;
    setHorizontalLineOneWidth(lineWidth * firstSegmentRatio);
    setHorizontalLineTwoWidth(lineWidth - horizontalLineOneWidth - annotWidthInPixels);

    setHorizontalLineTwoRight(notePanelWidth - notePanelLeftPadding + horizontalLineOneWidth);

    setHorizontalLineTwoTop(annotOriginY + (annotHeightInPixels / 2) - scrollTop);

  }, [annotation, displayMode, noteContainerRef, notePanelWidth, isNotesPanelOpen, isSelected, horizontalLineOneWidth, annotationWindowCoords]);

  if (isSelected && isLineOpen && isNotesPanelOpen) {
    const verticalHeight = Math.abs(horizontalLineOneTop - horizontalLineTwoTop);
    const verticalTop = horizontalLineOneTop > horizontalLineTwoTop ? horizontalLineTwoTop : horizontalLineOneTop;

    return (
      <LineConnectorPortal>
        <div className="lineHorizontal" style={{ width: horizontalLineOneWidth, right: horizontalLineOneRight, top: horizontalLineOneTop }}/>
        <div className="lineVertical" style={{ height: verticalHeight, top: verticalTop, right: horizontalLineOneRight +  horizontalLineOneWidth }}/>
        <div className="lineHorizontal" style={{ width: horizontalLineTwoWidth, right: horizontalLineTwoRight, top: horizontalLineTwoTop }}/>
      </LineConnectorPortal>);
  } else {
    return null;
  }
};

export default AnnotationLineConnector;