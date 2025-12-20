import getRootNode from 'helpers/getRootNode';
import core from 'core';

// This is the ratio of distance to the annotation that the right horizontal line should cover.
// Ideally, this is long enough to get away from the edge.
const LINE_WIDTH_RATIO = 0.75;

const adjustPointForWebcomponent = (coordinates, add = false) => {
  const { isApryseWebViewerWebComponent = false } = window;
  if (!isApryseWebViewerWebComponent) {
    return coordinates;
  }
  const appRect = getRootNode().getElementById('app').getBoundingClientRect();
  const rootLeft = appRect.left;
  const rootTop = appRect.top;
  return add ? {
    x: coordinates.x + rootLeft,
    y: coordinates.y + rootTop,
  } :{
    x: coordinates.x - rootLeft,
    y: coordinates.y - rootTop,
  };
};

export const getConnectorLines = ({
  annotationTopLeft,
  annotationBottomRight,
  noteContainerRef,
  bottomHeadersHeight,
  topHeadersHeight,
  activeDocumentViewerKey,
}) => {
  const { scrollTop, scrollLeft } = core.getScrollViewElement(activeDocumentViewerKey);
  const noteContainerRect = noteContainerRef.current.getBoundingClientRect();
  const containerRect = noteContainerRef.current.closest('.normal-notes-container, .virtualized-notes-container')?.getBoundingClientRect();
  if (noteContainerRect.bottom < containerRect?.top || noteContainerRect.top > containerRect?.bottom) {
    return {
      topLineStyle: { display: 'none' },
      verticalLineStyle: { display: 'none' },
      bottomLineStyle: { display: 'none' },
      isPanelOnLeft: false,
    };
  }
  annotationTopLeft = adjustPointForWebcomponent(annotationTopLeft, true);
  annotationBottomRight = adjustPointForWebcomponent(annotationBottomRight, true);
  const annotationHeight = annotationTopLeft.y - annotationBottomRight.y;
  const isPanelOnLeft = (annotationTopLeft.x - scrollLeft) > noteContainerRect.left;
  let horizontalDistanceToAnnotation;
  const SELECTION_POINT_WIDTH = 10;
  if (isPanelOnLeft) {
    horizontalDistanceToAnnotation = annotationTopLeft.x - noteContainerRect.right - scrollLeft;
    horizontalDistanceToAnnotation -= SELECTION_POINT_WIDTH  + 4; // 4px is arrow width
  }  else {
    horizontalDistanceToAnnotation = noteContainerRect.left - annotationBottomRight.x + scrollLeft;
    horizontalDistanceToAnnotation -= SELECTION_POINT_WIDTH;
  }
  const firstHorizontalLineLength = horizontalDistanceToAnnotation * LINE_WIDTH_RATIO;
  const secondHorizontalLineLength = horizontalDistanceToAnnotation - firstHorizontalLineLength;
  let verticalDistanceToAnnotation = annotationBottomRight.y - noteContainerRect.top + annotationHeight / 2 - scrollTop;
  const startPosition = adjustPointForWebcomponent({
    x: isPanelOnLeft ? noteContainerRect.right : noteContainerRect.left,
    y: noteContainerRect.top,
  });

  const LINE_WIDTH = 2;
  const topLineStyle = {
    width: firstHorizontalLineLength + (isPanelOnLeft ? LINE_WIDTH : 0),
    top: startPosition.y,
    left: startPosition.x - (isPanelOnLeft ? 0 : firstHorizontalLineLength),
  };
  const verticalLineStyle = {
    height: Math.abs(verticalDistanceToAnnotation) - LINE_WIDTH,
    top: topLineStyle.top + LINE_WIDTH,
    left: topLineStyle.left + (isPanelOnLeft ? firstHorizontalLineLength : 0),
  };
  if (verticalDistanceToAnnotation < 0) {
    verticalLineStyle.top = topLineStyle.top - verticalLineStyle.height;
  }
  let isAnnotationOffScreen = false;
  const appRect = getRootNode().getElementById('app').getBoundingClientRect();
  const topLimit = topHeadersHeight;
  if (topLimit > verticalLineStyle.top) {
    const diff = verticalLineStyle.top - topLimit;
    verticalLineStyle.top = topLimit;
    verticalLineStyle.height += diff;
    isAnnotationOffScreen = true;
  }
  const bottomLimit = appRect.height - bottomHeadersHeight;
  if (verticalLineStyle.top + verticalLineStyle.height > bottomLimit) {
    verticalLineStyle.height = bottomLimit - verticalLineStyle.top;
    isAnnotationOffScreen = true;
  }
  const bottomLineStyle = {
    width: secondHorizontalLineLength + (isPanelOnLeft ? LINE_WIDTH : 0),
    top: startPosition.y + verticalDistanceToAnnotation,
    left: verticalLineStyle.left + LINE_WIDTH - (!isPanelOnLeft ? secondHorizontalLineLength : LINE_WIDTH),
    visibility: isAnnotationOffScreen ? 'hidden' : 'visible',
  };
  return {
    topLineStyle,
    verticalLineStyle,
    bottomLineStyle,
    isPanelOnLeft,
  };
};
