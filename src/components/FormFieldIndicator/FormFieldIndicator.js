import React, { useEffect, useState } from 'react';
import { getAnnotationPosition } from 'helpers/getPopupPosition';
import core from 'core';

import './FormFieldIndicator.scss';

const FormFieldIndicator = ({ annotation }) => {
  const INDICATOR_HEIGHT = 40;
  const INDICATOR_WIDTH = 100;
  const INDICATOR_PADDING = 20;

  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [showIndicator, setShowIndicator] = useState(0);
  const [indicatorText, setIndicatorText] = useState('');
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [isRightSidePage, setIsRightSidePage] = useState(false);

  const setIndicatorYPosition = (annotation) => {
    const { scrollTop } = core.getScrollViewElement();
    const { bottomRight: annotationBottomRight, topLeft: annotationTopLeft } = getAnnotationPosition(annotation);
    const annotHeightInPixels = annotationBottomRight.y - annotationTopLeft.y;

    return annotationTopLeft.y + annotHeightInPixels / 2 - INDICATOR_HEIGHT / 2 - scrollTop;
  };

  const moveIndicatorToRightSide = (offset) => {
    setIsRightSidePage(true);
    const rightPosition = core.getViewerElement().getBoundingClientRect().right + INDICATOR_PADDING + offset;
    setXOffset(rightPosition);
  };

  if (!core.getDocument()) {
    return null;
  }

  useEffect(() => {
    const documentViewer = core.getDocumentViewer();
    const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
    const visiblePages = displayMode.getVisiblePages();
    const { scrollLeft } = core.getScrollViewElement();

    const leftPosition =
      core.getViewerElement().getBoundingClientRect().left - INDICATOR_WIDTH - INDICATOR_PADDING + scrollLeft;
    setXOffset(leftPosition);

    switch (displayMode.mode) {
      case 'Facing':
      case 'FacingContinuous':
        if (annotation.PageNumber % 2 === 0) {
          moveIndicatorToRightSide(scrollLeft);
        }
        break;
      case 'CoverFacing':
      case 'Cover':
        if (annotation.PageNumber % 2 !== 0) {
          moveIndicatorToRightSide(scrollLeft);
        }
        break;
    }

    const yPosition = setIndicatorYPosition(annotation);
    setYOffset(yPosition);

    setShowIndicator(annotation.getCustomData('trn-form-field-show-indicator') === 'true');

    setIndicatorText(annotation.getCustomData('trn-form-field-indicator-text'));

    setIsPlaceholder(annotation.isFormFieldPlaceholder());

    setIsPageVisible(visiblePages.includes(annotation.PageNumber));
  }, [annotation]);

  if (!showIndicator) {
    return null;
  }

  return (
    <div
      className={`formFieldIndicator ${isRightSidePage ? 'rightSidePage' : ''}`}
      style={{
        top: yOffset,
        left: xOffset,
        opacity: isPlaceholder ? 0.5 : 1,
        visibility: isPageVisible ? 'visible' : 'hidden',
      }}
    >
      <div className="formFieldIndicator-text">{indicatorText}</div>
    </div>
  );
};

export default FormFieldIndicator;
