import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import core from 'core';
import selectors from 'selectors';

import './AnnotationContentOverlay.scss';

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

  useEffect(() => {
    const onMouseHover = e => {
      const annotation = core
        .getAnnotationManager()
        .getAnnotationByMouseEvent(e);

      setAnnotation(annotation);
      if (annotation) {
        setOverlayPosition({
          left: e.clientX + 20,
          top: e.clientY + 20,
        });
      }
    };
    core.addEventListener('mouseMove', onMouseHover);
    return () => {
      core.removeEventListener('mouseMove', onMouseHover);
    };
  }, []);

  const contents = annotation?.getContents();
  const numberOfReplies = annotation?.getReplies().length;

  return isDisabled || !contents ? null : (
    <div
      className="Overlay AnnotationContentOverlay"
      data-element="annotationContentOverlay"
      style={{ ...overlayPosition }}
    >
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
    </div>
  );
};

export default AnnotationContentOverlay;
