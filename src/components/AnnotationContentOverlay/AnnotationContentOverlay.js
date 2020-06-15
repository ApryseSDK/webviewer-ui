/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import core from 'core';
import { isMobileDevice } from 'helpers/device';
import selectors from 'selectors';

import './AnnotationContentOverlay.scss';

import CustomElement from '../CustomElement';

const MAX_CHARACTERS = 100;

const AnnotationContentOverlay = () => {
  const isDisabled = useSelector(state =>
    selectors.isElementDisabled(state, 'annotationContentOverlay'),
  );
  const [t] = useTranslation();
  const [annotation, setAnnotation] = useState();
  const [overlayPosition, setOverlayPosition] = useState({
    left: 0,
    top: 0,
  });

  // Clients have the option to customize how the tooltip is rendered
  // by passing a handler
  const customHandler = useSelector(state =>
    selectors.getAnnotationContentOverlayHandler(state),
  );
  const isUsingCustomHandler = customHandler !== null;

  useEffect(() => {
    const onMouseHover = e => {
      const viewElement = core.getViewerElement();
      let annotation = core
        .getAnnotationManager()
        .getAnnotationByMouseEvent(e);

      if (annotation && viewElement.contains(e.target)) {
        // if hovered annot is grouped, pick the "primary" annot to match Adobe's behavior
        const groupedAnnots = core.getAnnotationManager().getGroupAnnotations(annotation);
        const ungroupedAnnots = groupedAnnots.filter(annot => !annot.isGrouped());
        annotation = ungroupedAnnots.length > 0 ? ungroupedAnnots[0] : annotation;

        if (!(annotation instanceof Annotations.FreeTextAnnotation)) {
          setAnnotation(annotation);
          setOverlayPosition({
            left: e.clientX + 20,
            top: e.clientY + 20,
          });
        }
      } else {
        setAnnotation(null);
      }
    };

    core.addEventListener('mouseMove', onMouseHover);
    return () => {
      core.removeEventListener('mouseMove', onMouseHover);
    };
  }, []);

  const contents = annotation?.getContents();
  const numberOfReplies = annotation?.getReplies().length;

  const OverlayWrapper = props => (
    <div
      className="Overlay AnnotationContentOverlay"
      data-element="annotationContentOverlay"
      style={{ ...overlayPosition }}
    >
      {props.children}
    </div>
  );

  const CustomOverlay = () => {
    if (annotation) {
      return (
        <OverlayWrapper>
          <CustomElement render={() => customHandler(annotation)} />
        </OverlayWrapper>
      );
    } else {
      return null;
    }
  };

  const DefaultOverlay = () => {
    if (contents) {
      return (
        <OverlayWrapper>
          <div className="author">{core.getDisplayAuthor(annotation)}</div>
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
        </OverlayWrapper>
      );
    } else {
      return null;
    }
  };

  if (isDisabled || isMobileDevice) {
    return null;
  } else if (isUsingCustomHandler) {
    return <CustomOverlay />;
  } else {
    return <DefaultOverlay />;
  }

};

export default AnnotationContentOverlay;
