import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import core from 'core';
import selectors from 'selectors';

import { isMobileDevice } from 'helpers/device';
import DataElements from 'constants/dataElement';
import CustomElement from '../CustomElement';
import FormFieldWidgetOverlay from './FormFieldWidgetOverlay';
import './AnnotationContentOverlay.scss';
import getRootNode from 'src/helpers/getRootNode';

const MAX_CHARACTERS = 100;

const propTypes = {
  annotation: PropTypes.object,
  clientXY: PropTypes.object,
};

const AnnotationContentOverlay = ({ annotation, clientXY }) => {
  const [
    isDisabled,
    isOverlayOpen,
    // Clients have the option to customize how the tooltip is rendered by passing a handler
    customHandler,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.ANNOTATION_CONTENT_OVERLAY),
    selectors.isElementOpen(state, DataElements.ANNOTATION_CONTENT_OVERLAY),
    selectors.getAnnotationContentOverlayHandler(state),
  ], shallowEqual);

  const [t] = useTranslation();
  const [overlayPosition, setOverlayPosition] = useState({
    left: -99999,
    top: -99999,
  });

  const isUsingCustomHandler = customHandler !== null;
  const overlayRef = useRef(null);
  const contents = annotation?.getContents();
  // the gap between the component and the mouse, to make sure that the mouse won't be on component element
  // so that the underlying annotation will always be hovered
  const gap = 20;

  const fitWindowSize = useCallback((clientX, clientY, left, top) => {
    const overlayRect = overlayRef.current.getBoundingClientRect();

    if (left + overlayRect.width > window.innerWidth) {
      left = clientX - overlayRect.width - gap;
    }

    if (top + overlayRect.height > window.innerHeight) {
      top = clientY - overlayRect.height - gap;
    }

    if (top <= 0) {
      top = 0;
    }

    if (window.isApryseWebViewerWebComponent) {
      const host = getRootNode()?.host;
      const hostBoundingRect = host?.getBoundingClientRect();
      if (hostBoundingRect) {
        left -= hostBoundingRect.left;
        top -= hostBoundingRect.top;

        // Include host scroll offsets
        left += host.scrollLeft;
        top += host.scrollTop;
      }
    }

    return { left, top };
  }, []);

  useEffect(() => {
    if (overlayRef.current && annotation) {
      const { clientX, clientY } = clientXY;
      const { left, top } = fitWindowSize(clientX, clientY, clientX + gap, clientY + gap);
      setOverlayPosition({ left, top });
    }
  }, [annotation, clientXY, fitWindowSize]);

  const numberOfReplies = annotation?.getReplies().length;
  const preRenderedElements = isUsingCustomHandler && annotation ? customHandler(annotation) : null;
  const customRender = useCallback(() => preRenderedElements, [preRenderedElements]);

  const renderContents = () => (
    <div
      className="Overlay AnnotationContentOverlay"
      data-element={DataElements.ANNOTATION_CONTENT_OVERLAY}
      style={{ ...overlayPosition }}
      ref={overlayRef}
    >
      <div className="author">{core.getDisplayAuthor(annotation['Author'])}</div>
      <div className="contents">
        {contents.length > MAX_CHARACTERS
          ? `${contents.slice(0, MAX_CHARACTERS)}...`
          : contents}
      </div>
      {numberOfReplies > 0 && (
        <div className="replies">
          {t('message.annotationReplyCount', { count: numberOfReplies })}
        </div>
      )}
    </div>
  );

  if (isDisabled || isMobileDevice || !annotation) {
    return null;
  }

  if (isUsingCustomHandler && isOverlayOpen && preRenderedElements !== undefined) {
    if (preRenderedElements) {
      return (
        <div
          className="Overlay AnnotationContentOverlay"
          data-element={DataElements.ANNOTATION_CONTENT_OVERLAY}
          style={{ ...overlayPosition }}
          ref={overlayRef}
        >
          <CustomElement render={customRender} />
        </div>
      );
    }
    return null;
  }

  const isInFormFieldCreationMode = core.getFormFieldCreationManager().isInFormFieldCreationMode();

  if (isOverlayOpen && isInFormFieldCreationMode && annotation instanceof window.Core.Annotations.WidgetAnnotation) {
    return (
      <FormFieldWidgetOverlay
        annotation={annotation}
        overlayPosition={overlayPosition}
        overlayRef={overlayRef}
      />
    );
  }

  if (contents && isOverlayOpen) {
    return renderContents();
  }

  return null;
};

AnnotationContentOverlay.propTypes = propTypes;

export default AnnotationContentOverlay;
