import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import core from 'core';
import selectors from 'selectors';

import './AnnotationOverlay.scss';

const MAX_WORDS = 100;

const AnnotationOverlay = () => {
  const isDisabled = useSelector(state => 
    selectors.isElementDisabled(state, 'annotationOverlay')
  );
  const [isOpen, setIsOpen] = useState(false);
  const [annotation, setAnnotation] = useState();
  const [repliesCount, setRepliesCount] = useState(0);
  const [overlayPosition, setOverlayPosition] = useState();
  
  const am = core.getAnnotationManager();
  
  useEffect(() => {
    window.docViewer.on('mouseMove.hover', onMouseHover);
    return () => {
      window.docViewer.off('mouseMove.hover', onMouseHover);
    }
  }, []);
    
  const onMouseHover = (e, mouseEvent) => {
    const annotation = am.getAnnotationByMouseEvent(mouseEvent);
    setIsOpen(!!annotation);
    if (annotation) {
      setAnnotation(annotation);
      setOverlayPosition({
        left: mouseEvent.clientX + 20,
        top:mouseEvent.clientY + 20
      });
      setRepliesCount(annotation.getReplies().length);
    }
  }

  if (!isDisabled && isOpen && annotation && annotation.getContents()) {
    const { left = 0, top = 0 } = overlayPosition;
    let contents = annotation.getContents();
    // display upto MAX_WORDS characters
    if (contents && contents.length > MAX_WORDS) {
      contents = contents.slice(0, MAX_WORDS);
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