import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import core from 'core';
import selectors from 'selectors';

import './AnnotationOverlay.scss';

const MAX_CHARACTERS = 100;

const AnnotationOverlay = (props) => {
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
  let contents = annotation ? annotation.getContents() : null;
  if (!isDisabled && contents) {
    const { left, top } = overlayPosition;
    const repliesCount = annotation.getReplies().length || 0;
    // display upto MAX_CHARACTERS characters
    if (contents.length > MAX_CHARACTERS) {
      contents = contents.slice(0, MAX_CHARACTERS);
      contents += '...';
    }
    const { t } = props;
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
          {repliesCount > 0 && `${t('action.reply')} (${repliesCount})`}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default connect()(withTranslation()(AnnotationOverlay));
