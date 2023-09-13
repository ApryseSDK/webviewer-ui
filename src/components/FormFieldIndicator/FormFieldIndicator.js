import React from 'react';
import { getAnnotationPosition } from 'helpers/getPopupPosition';

import './FormFieldIndicator.scss';

const INDICATOR_HEIGHT = 40;
const INDICATOR_WIDTH = 100;
const INDICATOR_PADDING = 20;

const FormFieldIndicator = ({ annotation, parameters }) => {
  const { displayMode, viewerBoundingRect, appBoundingRect, scrollLeft, scrollTop } = parameters;

  const setIndicatorYPosition = (annotation) => {
    try {
      const { bottomRight: annotationBottomRight, topLeft: annotationTopLeft } = getAnnotationPosition(annotation);
      const annotHeightInPixels = annotationBottomRight.y - annotationTopLeft.y;
      return annotationTopLeft.y + annotHeightInPixels / 2 - INDICATOR_HEIGHT / 2 - scrollTop;
    } catch (e) {
      return 0;
    }
  };

  let visiblePages = [];
  try {
    visiblePages = displayMode.getVisiblePages();
  } catch (e) { }

  const origin = appBoundingRect.left;
  const leftPosition = viewerBoundingRect.left
  - INDICATOR_WIDTH - INDICATOR_PADDING + scrollLeft;

  let xOffset = leftPosition - origin;
  const yOffset = setIndicatorYPosition(annotation);
  let isRightSidePage = false;

  switch (displayMode.mode) {
    case 'Facing':
    case 'FacingContinuous':
      if (annotation.PageNumber % 2 === 0) {
        isRightSidePage = true;
        xOffset = viewerBoundingRect.right + INDICATOR_PADDING + scrollLeft;
      }
      break;
    case 'CoverFacing':
    case 'Cover':
      if (annotation.PageNumber % 2 !== 0) {
        isRightSidePage = true;
        xOffset = viewerBoundingRect.right + INDICATOR_PADDING + scrollLeft;
      }
      break;
  }

  const isPlaceholder = annotation.isFormFieldPlaceholder();
  const isPageVisible = visiblePages.includes(annotation.PageNumber);
  const indicatorText = annotation.getCustomData('trn-form-field-indicator-text');

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
