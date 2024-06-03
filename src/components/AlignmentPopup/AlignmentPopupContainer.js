import actions from 'actions';
import classNames from 'classnames';
import core from 'core';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import PropTypes from 'prop-types';
import selectors from 'selectors';

import AlignmentPopup from './AlignmentPopup';
import './AlignmentPopup.scss';
import DataElementWrapper from '../DataElementWrapper';
import DataElements from 'src/constants/dataElement';
import { alignmentConfig, distributeConfig } from './AlignmentConfig';

const propTypes = {
  annotation: PropTypes.object,
};

const AlignmentPopupContainer = ({
  annotation
}) => {
  const [
    isOpen,
    activeDocumentViewerKey
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElements.ANNOTATION_ALIGNMENT_POPUP),
      selectors.getActiveDocumentViewerKey(state),
    ],
    shallowEqual,
  );

  const [position, setPosition] = useState({ left: 0, top: 0 });
  const popupRef = useRef();
  const dispatch = useDispatch();

  const alignmentOnClick = (alignment) => {
    const annotManager = core.getAnnotationManager();
    const selectedAnnotations = annotManager.getSelectedAnnotations();
    if (alignment === 'centerHorizontal' || alignment === 'centerVertical') {
      annotManager.Alignment.centerAnnotations(selectedAnnotations, alignment);
    } else {
      annotManager.Alignment.alignAnnotations(selectedAnnotations, alignment);
    }
    setPopupPosition();
  };

  const distributeOnClick = (alignment) => {
    const annotManager = core.getAnnotationManager();
    const selectedAnnotations = annotManager.getSelectedAnnotations();
    annotManager.Alignment.distributeAnnotations(selectedAnnotations, alignment);
    setPopupPosition();
  };

  const backToMenuOnClick = () => {
    dispatch(actions.closeElement(DataElements.ANNOTATION_ALIGNMENT_POPUP));
    const annotManager = core.getAnnotationManager();
    const selectedAnnotations = annotManager.getSelectedAnnotations();
    annotManager.selectAnnotations(selectedAnnotations);
  };

  useLayoutEffect(() => {
    if (annotation || isOpen) {
      setPopupPosition();
    }
  }, [annotation, isOpen, activeDocumentViewerKey]);

  const setPopupPosition = () => {
    if (annotation && popupRef.current) {
      setPosition(getAnnotationPopupPositionBasedOn(annotation, popupRef, activeDocumentViewerKey));
    }
  };

  const className = classNames({
    Popup: true,
    AlignAnnotationPopupContainer: true,
    open: isOpen,
    closed: !isOpen,
  });

  const isAnnotation = annotation !== undefined;

  return (
    <DataElementWrapper
      dataElement={DataElements.ANNOTATION_ALIGNMENT_POPUP}
      className={className}
      style={{ ...position }}
      ref={popupRef}
    >
      <AlignmentPopup
        alignmentConfig={alignmentConfig}
        alignmentOnClick={alignmentOnClick}
        backToMenuOnClick={backToMenuOnClick}
        distributeConfig={distributeConfig}
        distributeOnClick={distributeOnClick}
        isAnnotation={isAnnotation}
      />
    </DataElementWrapper>
  );
};

AlignmentPopupContainer.propTypes = propTypes;

export default AlignmentPopupContainer;
