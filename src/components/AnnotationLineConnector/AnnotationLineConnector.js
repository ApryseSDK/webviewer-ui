import React, { useEffect, useContext, useState } from 'react';
import NoteContext from 'components/Note/Context';
import { useSelector, shallowEqual } from 'react-redux';
import core from 'core';
import selectors from 'selectors';
import { createPortal } from 'react-dom';
import { getAnnotationPosition } from '../../helpers/getPopupPosition';

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
  const [notePanelWidth, isLineOpen, isNotesPanelOpen, isLineDisabled] = useSelector(
    state => [
      selectors.getNotesPanelWidth(state),
      selectors.isElementOpen(state, 'annotationLineConnector'),
      selectors.isElementOpen(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'annotationLineConnector')
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
  const { bottomRight: annotBottomRight, topLeft: annotTopLeft } = getAnnotationPosition(annotation);

  useEffect(() => {
    const { scrollTop, scrollLeft } = core.getScrollViewElement();
    const notePanelLeftPadding = 16;

    const annotWidthInPixels = annotBottomRight.x - annotTopLeft.x;
    const annotHeightInPixels = annotBottomRight.y - annotTopLeft.y;

    setHorizontalLineOneRight(notePanelWidth - notePanelLeftPadding);
    setHorizontalLineOneTop(noteContainerRef.current.getBoundingClientRect().top);

    const lineWidth = window.innerWidth - notePanelWidth - annotTopLeft.x + notePanelLeftPadding + scrollLeft - annotWidthInPixels;
    const firstSegmentRatio = 0.75;
    setHorizontalLineOneWidth(lineWidth * firstSegmentRatio);
    setHorizontalLineTwoWidth(lineWidth - horizontalLineOneWidth);

    setHorizontalLineTwoRight(notePanelWidth - notePanelLeftPadding + horizontalLineOneWidth);

    setHorizontalLineTwoTop(annotTopLeft.y + (annotHeightInPixels / 2) - scrollTop);

  }, [noteContainerRef, notePanelWidth, horizontalLineOneWidth, annotBottomRight, annotTopLeft]);

  if (isSelected && isLineOpen && isNotesPanelOpen && !isLineDisabled) {
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