import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import core from 'core';
import selectors from 'selectors';

import './AnnotationOverlay.scss';

const MAX_CHARACTERS = 100;

const AnnotationOverlay = () => {
  const isDisabled = useSelector(state => 
    selectors.isElementDisabled(state, 'annotationOverlay')
  );
  const [annotation, setAnnotation] = useState();
  const [overlayPosition, setOverlayPosition] = useState({
    left: 0,
    top: 0
  });
  
  const am = core.getAnnotationManager();
  
  useEffect(() => {
    const onMouseHover = (e, mouseEvent) => {
      const annotation = am.getAnnotationByMouseEvent(mouseEvent);
      setAnnotation(annotation);
      if (annotation) {
        setOverlayPosition({
          left: mouseEvent.clientX + 20,
          top: mouseEvent.clientY + 20
        });
      }
    }
    core.addEventListener('mouseMove', onMouseHover);
    return () => {
      core.removeEventListener('mouseMove', onMouseHover)
    }
  }, []);

  if (!isDisabled && annotation && annotation.getContents()) {
    const { left, top } = overlayPosition;
    const repliesCount = annotation.getReplies().length || 0;
    let contents = annotation.getContents();
    // display upto MAX_CHARACTERS characters
    if (contents && contents.length > MAX_CHARACTERS) {
      contents = contents.slice(0, MAX_CHARACTERS);
      contents += '...';
    }
    return (
      <div 
        className="Overlay AnnotationOverlay"
        data-element="annotationOverlay"
        style={{ left, top }}
      >
        <div className="author">
          {annotation.Author}
        </div>
        <div>
          {contents}
        </div>
        <div>
          {repliesCount > 0 && `Replies (${repliesCount})`}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default (withTranslation()(AnnotationOverlay));