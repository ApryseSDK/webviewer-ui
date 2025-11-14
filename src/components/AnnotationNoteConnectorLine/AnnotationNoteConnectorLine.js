import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import core from 'core';
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
  parentScroll: PropTypes.object,
};

const AnnotationNoteConnectorLine = ({ annotation, noteContainerRef, isCustomPanelOpen, parentScroll }) => {
  const [
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
  useEffect(() => {
    calculatePosition({
      activeDocumentViewerKey,
      bottomHeadersHeight,
      topHeadersHeight,
    });
  }, [
    noteContainerRef,
    parentScroll.current,
    documentContainerWidth,
    documentContainerHeight,
    scrollViewElement,
    scrollViewElement?.scrollTop,
    scrollViewElement?.scrollLeft,
    notePanelWidth,
    bottomHeadersHeight,
    topHeadersHeight,
    activeDocumentViewerKey,
    ...annotDeps,
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
      <LineConnectorPortal>
        <div className="horizontalLine" style={topLineStyle}/>
        <div className="verticalLine" style={verticalLineStyle}/>
        <div className="horizontalLine" style={bottomLineStyle}>
          <div className={classNames('arrowHead', { 'arrow-right': isPanelOnLeft })} />
        </div>
      </LineConnectorPortal>
    );
  }
  return null;
};

AnnotationNoteConnectorLine.propTypes = propTypes;

export default AnnotationNoteConnectorLine;
