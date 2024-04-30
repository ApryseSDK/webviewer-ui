import actions from 'actions';
import classNames from 'classnames';
import core from 'core';
import DataElements from 'constants/dataElement';
import DataElementWrapper from '../DataElementWrapper';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import { isMobileDevice } from 'helpers/device';
import LinkAnnotationPopup from './LinkAnnotationPopup';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import getLinkDestination from 'helpers/getLinkDestination';
import useOnClickOutside from 'hooks/useOnClickOutside';
import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect
} from 'react';
import {
  useSelector,
  shallowEqual,
  useDispatch
} from 'react-redux';
import getGroupedLinkAnnotations from 'src/helpers/getGroupedLinkAnnotations';

const { Annotations } = window.Core;

const propTypes = {
  annotation: PropTypes.object,
  handleOnMouseEnter: PropTypes.func,
  handleOnMouseLeave: PropTypes.func,
};

export const deleteLinkAnnotationWithGroup = (annotation, activeDocumentViewerKey = 1) => {
  const annotationManager = core.getAnnotationManager(activeDocumentViewerKey);
  const textHighlightAnnotation = annotationManager.getGroupAnnotations(annotation).find((annot, index) => annot instanceof Annotations.TextHighlightAnnotation && annot.Opacity === 0 && index === 0);
  const linkAnnotations = getGroupedLinkAnnotations(annotation);
  linkAnnotations.forEach((linkAnnot) => {
    annotationManager.ungroupAnnotations([linkAnnot]);
    if (textHighlightAnnotation) {
      annotationManager.deleteAnnotation(linkAnnot, { 'source': 'unlink' }, true);
    }
  });
  annotationManager.deleteAnnotation(annotation, { 'source': 'unlink' }, true);
};

const LinkAnnotationPopupContainer = ({
  annotation,
  handleOnMouseEnter,
  handleOnMouseLeave
}) => {
  const [
    isOpen,
    activeDocumentViewerKey,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, DataElements.LINK_ANNOTATION_POPUP),
    selectors.getActiveDocumentViewerKey(state),
  ], shallowEqual);

  const [position, setPosition] = useState({ left: 0, top: 0 });
  const dispatch = useDispatch();
  const popupRef = useRef(null);

  const closePopup = () => dispatch(actions.closeElement(DataElements.LINK_ANNOTATION_POPUP));

  const handleMouseMove = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  useOnClickOutside(popupRef, () => {
    if (isOpen) {
      closePopup();
    }
  });

  useEffect(() => {
    const onScroll = () => {
      closePopup();
    };

    const scrollViewElement = core.getScrollViewElement();
    scrollViewElement?.addEventListener('scroll', onScroll);
    return () => {
      scrollViewElement?.removeEventListener('scroll', onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    if (annotation || isOpen) {
      setPopupPosition();
    }
  }, [annotation, isOpen, activeDocumentViewerKey]);

  const setPopupPosition = () => {
    if (annotation && popupRef.current) {
      setPosition(getAnnotationPopupPositionBasedOn(annotation, popupRef, activeDocumentViewerKey, 5));
    }
  };

  const contents = getLinkDestination(annotation) || '';

  const handleUnLink = () => {
    deleteLinkAnnotationWithGroup(annotation, activeDocumentViewerKey);
    closePopup();
    handleOnMouseLeave();
  };

  const className = classNames({
    Popup: true,
    LinkAnnotationPopupContainer: true,
    open: isOpen,
    closed: !isOpen,
  });

  const isAnnotation = annotation !== undefined;

  return (
    <DataElementWrapper
      dataElement={DataElements.LINK_ANNOTATION_POPUP}
      className={className}
      style={{ ...position }}
      ref={popupRef}
    >
      <LinkAnnotationPopup
        linkText={contents}
        handleUnLink={handleUnLink}
        isAnnotation={isAnnotation}
        isMobileDevice={isMobileDevice}
        handleOnMouseEnter={handleOnMouseEnter}
        handleOnMouseLeave={handleOnMouseLeave}
        handleMouseMove={handleMouseMove}
      />
    </DataElementWrapper>

  );
};

LinkAnnotationPopupContainer.propTypes = propTypes;

export default LinkAnnotationPopupContainer;