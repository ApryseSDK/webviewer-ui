export const calculateHorizontalDistanceToAnnotation = ({
  viewerWidth,
  annotationXPosition,
  annotationWidth,
  notePanelWidth,
  notePanelPadding,
  notesPanelResizeBarWidth,
  scrollLeft,
}) => {
  const distanceToAnnotation =
      viewerWidth -
      annotationXPosition -
      annotationWidth -
      notePanelWidth +
      notePanelPadding +
      notesPanelResizeBarWidth +
      scrollLeft;
  return distanceToAnnotation;
};

export const calculateRightHorizontalLineProperties = ({
  notePanelWidth,
  notePanelPadding,
  notesPanelResizeBarWidth,
  notesContainerTop,
  viewerOffsetTop,
  distanceToAnnotation,
  lineWidthRatio = 0.75,
}) => {
  // Calculate the left side of the note in the notes panel
  const rightHorizontalLineRightOffset = notePanelWidth - notePanelPadding - notesPanelResizeBarWidth;
  const rightHorizontalLineTopOffset = notesContainerTop - viewerOffsetTop;
  const rightHorizontalLineLength = distanceToAnnotation * lineWidthRatio;

  return {
    rightHorizontalLineRightOffset,
    rightHorizontalLineTopOffset,
    rightHorizontalLineLength,
  };
};

export const calculateLeftHorizontalLineProperties = ({
  isAnnotationNoZoom,
  annotationNoZoomReferencePoint,
  annotationHeight,
  notePanelWidth,
  notePanelPadding,
  notesPanelResizeBarWidth,
  rightHorizontalLineLength,
  distanceToAnnotation,
  annotationTopLeftY,
  scrollTop,
  annotationLineOffset,
}) => {
  // Annotation could have NoZoom set, so we need to adjust the line position relative to it's NoZoom reference point
  const noZoomRefShiftX =
    isAnnotationNoZoom && annotationNoZoomReferencePoint.x ? annotationNoZoomReferencePoint.x * annotationHeight : 0;
  const noZoomRefShiftY =
    isAnnotationNoZoom && annotationNoZoomReferencePoint.y ? annotationNoZoomReferencePoint.y * annotationHeight : 0;

  const leftHorizontalLineRightOffset =
    notePanelWidth - notePanelPadding - notesPanelResizeBarWidth + rightHorizontalLineLength;
  const leftHorizontalLineTopOffset = annotationTopLeftY + annotationHeight / 2 - scrollTop - noZoomRefShiftY;
  const leftHorizontalLineLength =
    distanceToAnnotation - rightHorizontalLineLength - annotationLineOffset + noZoomRefShiftX;

  return {
    leftHorizontalLineRightOffset,
    leftHorizontalLineTopOffset,
    leftHorizontalLineLength,
  };
};

export const calculateMiddleVerticalLineProperties = ({
  rightHorizontalLineTop,
  leftHorizontalLineTop,
  bottomHeaderTop,
  topHeadersHeight,
  isCustomUIEnabled,
}) => {
  const horizontalLineHeight = 2;
  // Add HorizontalLineHeight of 2px when annot is above note to prevent little gap between lines
  let verticalLineTop =
    rightHorizontalLineTop > leftHorizontalLineTop
      ? leftHorizontalLineTop + horizontalLineHeight
      : rightHorizontalLineTop;
  let verticalLineHeight = Math.abs(rightHorizontalLineTop - leftHorizontalLineTop);

  const verticalLineBottom = verticalLineTop + verticalLineHeight;

  const isAnnotationAboveViewer = verticalLineTop < topHeadersHeight;
  const isAnnotationBelow = verticalLineBottom > bottomHeaderTop;

  const isAnnotationOffScreen = isAnnotationAboveViewer || isAnnotationBelow;

  if (isAnnotationOffScreen && isCustomUIEnabled) {
    if (isAnnotationAboveViewer) {
      // If the annotation is above the viewer, we need to extend the vertical line to the top headers
      verticalLineHeight = Math.abs(rightHorizontalLineTop - topHeadersHeight) + horizontalLineHeight;
      verticalLineTop = topHeadersHeight;
    } else if (isAnnotationBelow) {
      // If the annotation is below the viewer, we need to extend the vertical line to the bottom headers
      verticalLineHeight = Math.abs(bottomHeaderTop - rightHorizontalLineTop);
    }
  }

  return {
    verticalLineTop,
    verticalLineHeight,
    isAnnotationOffScreen,
  };
};