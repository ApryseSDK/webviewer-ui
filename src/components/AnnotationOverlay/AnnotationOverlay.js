import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import core from 'core';
import selectors from 'selectors';

import './AnnotationOverlay.scss';

const MAX_CHARACTERS = 100;

const AnnotationOverlay = () => {
  const isDisabled = useSelector(state =>
    selectors.isElementDisabled(state, 'annotationOverlay'),
  );
  const [t] = useTranslation();
  const [annotation, setAnnotation] = useState();
  const [overlayPosition, setOverlayPosition] = useState({
    left: 0,
    top: 0,
  });

  useEffect(() => {
    const onMouseHover = (e, mouseEvent) => {
      const annotation = core
        .getAnnotationManager()
        .getAnnotationByMouseEvent(mouseEvent);

      setAnnotation(annotation);
      if (annotation) {
        setOverlayPosition({
          left: mouseEvent.clientX + 20,
          top: mouseEvent.clientY + 20,
        });
      }
    };
    core.addEventListener('mouseMove', onMouseHover);
    return () => {
      core.removeEventListener('mouseMove', onMouseHover);
    };
  }, []);

  const contents = annotation?.getContents();
  const replies = annotation?.getReplies();

  return isDisabled || !contents ? null : (
    <div
      className="Overlay AnnotationOverlay"
      data-element="annotationOverlay"
      style={{ ...overlayPosition }}
    >
      <div className="author">{core.getDisplayAuthor(annotation)}</div>
      <div className="contents">
        {contents.length > MAX_CHARACTERS
          ? `${contents.slice(0, MAX_CHARACTERS)}...`
          : contents}
      </div>
      {replies.length > 0 && (
        <div className="replies">
          {`${t('action.reply')} (${replies.length})`}
        </div>
      )}
    </div>
  );
};

export default AnnotationOverlay;
