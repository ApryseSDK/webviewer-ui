import { useState, useRef, useCallback } from 'react';
import core from 'core';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const DEFAULT_CONTAINER_TOP_OFFSET = 85;
const DEFAULT_CONTAINER_RIGHT_OFFSET = 35;
const DEFAULT_WIDTH_RATIO = 0.666;
const DEFAULT_DISTANCE = 10;

const calculateTopPosition = (verticalPosition, containerRef, documentElement, documentContainerHeight, documentContainerElement) => {
  if (verticalPosition === 'top') {
    return documentElement?.offsetTop + DEFAULT_DISTANCE || DEFAULT_CONTAINER_TOP_OFFSET;
  }

  let containerHeight = 400;
  if (containerRef?.current) {
    containerHeight = containerRef.current.getBoundingClientRect().height;
  }
  return documentContainerHeight + documentContainerElement?.offsetTop - DEFAULT_DISTANCE - containerHeight || DEFAULT_CONTAINER_TOP_OFFSET;
};

const calculateRightPosition = (documentContainerWidth, documentElement, containerRef) => {
  let offset = documentContainerWidth * DEFAULT_WIDTH_RATIO;

  if (!documentElement || !containerRef?.current) {
    return offset;
  }

  const rightEdgePosition = documentElement?.offsetLeft + documentElement?.offsetWidth + DEFAULT_DISTANCE || offset;
  const maxAllowedPosition = documentContainerWidth - containerRef.current.getBoundingClientRect().width - DEFAULT_DISTANCE;
  return Math.min(rightEdgePosition, maxAllowedPosition);
};

const calculateLeftPosition = (documentElement, containerRef, documentContainerElement) => {
  if (!documentElement || !containerRef?.current) {
    return DEFAULT_DISTANCE;
  }

  const containerWidth = containerRef.current.getBoundingClientRect().width;
  let offset = documentElement?.offsetLeft - DEFAULT_DISTANCE - containerWidth || DEFAULT_DISTANCE;

  if (documentContainerElement && offset < documentContainerElement.offsetLeft) {
    offset = documentContainerElement.offsetLeft + DEFAULT_DISTANCE;
  }

  if (!offset || isNaN(offset) || offset < 0) {
    offset = DEFAULT_DISTANCE;
  }

  return offset;
};

const calculateTopBounds = (documentContainerHeight, containerRef) => {
  const bounds = { top: 0, bottom: documentContainerHeight - (DEFAULT_DISTANCE * 2) };

  if (containerRef.current) {
    bounds.bottom -= containerRef.current.getBoundingClientRect().height;
  } else {
    bounds.bottom -= DEFAULT_CONTAINER_TOP_OFFSET;
  }

  return bounds;
};

const calculateBottomBounds = (documentContainerHeight, containerRef) => {
  const bounds = { top: -documentContainerHeight + (DEFAULT_DISTANCE * 2), bottom: 0 };

  if (containerRef.current) {
    bounds.top += containerRef.current.getBoundingClientRect().height;
  } else {
    bounds.top += DEFAULT_CONTAINER_TOP_OFFSET;
  }

  return bounds;
};

const calculateVerticalBounds = (verticalPosition, documentContainerHeight, containerRef) => {
  if (verticalPosition === 'top') {
    return calculateTopBounds(documentContainerHeight, containerRef);
  } else if (verticalPosition === 'bottom') {
    return calculateBottomBounds(documentContainerHeight, containerRef);
  }
  console.warn(`Invalid vertical position: ${verticalPosition}. Defaulting to top bounds.`);
  return calculateTopBounds(documentContainerHeight, containerRef);
};

const calculateRightHorizontalBounds = (documentContainerWidth, style) => {
  const bounds = { left: -documentContainerWidth, right: documentContainerWidth / 3 };

  if (style) {
    bounds.right = documentContainerWidth - style['left'];
  }

  return bounds;
};

const calculateLeftHorizontalBounds = (documentContainerElement, documentContainerWidth, style) => {
  const bounds = {
    left: documentContainerElement?.offsetLeft || 0,
    right: documentContainerWidth - DEFAULT_DISTANCE - DEFAULT_CONTAINER_RIGHT_OFFSET
  };

  if (style) {
    bounds.left = Math.max(0, documentContainerElement?.offsetLeft - style['left'] + DEFAULT_DISTANCE);
    bounds.right -= style['left'];
  }

  return bounds;
};

const useDraggablePosition = (initialPosition) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const documentContainerWidth = useSelector(selectors.getDocumentContainerWidth);
  const documentContainerHeight = useSelector(selectors.getDocumentContainerHeight);

  const documentElement = core.getViewerElement();
  const documentContainerElement = core.getScrollViewElement();

  const handleDrag = useCallback((e, { x, y }) => {
    setPosition({ x, y });
  }, []);

  const handleStop = useCallback((e, { x, y }) => {
    setPosition({ x, y });
  }, []);


  const parseInitialPosition = (initialPosition) => {
    const initialPositionParts = initialPosition.split('-');
    const [verticalPosition, horizontalPosition] = initialPositionParts;
    return { verticalPosition, horizontalPosition };
  };

  const calculateStyle = useCallback(() => {
    if (!initialPosition) {
      return { left: 0, top: 0 };
    }

    const { verticalPosition, horizontalPosition } = parseInitialPosition(initialPosition);
    const offset = { left: 0, top: 0 };

    offset.top = calculateTopPosition(verticalPosition, containerRef, documentElement, documentContainerHeight, documentContainerElement);

    if (horizontalPosition === 'right') {
      offset.left = calculateRightPosition(documentContainerWidth, documentElement, containerRef);
    } else {
      offset.left = calculateLeftPosition(documentElement, containerRef, documentContainerElement);
    }

    return offset;
  }, [initialPosition, documentContainerWidth, documentContainerHeight, documentElement, documentContainerElement]);

  const containerBounds = useCallback(() => {
    if (!initialPosition) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const { verticalPosition, horizontalPosition } = parseInitialPosition(initialPosition);
    const style = calculateStyle();

    const verticalBounds = calculateVerticalBounds(verticalPosition, documentContainerHeight, containerRef);

    let horizontalBounds;
    if (horizontalPosition === 'right') {
      horizontalBounds = calculateRightHorizontalBounds(documentContainerWidth, style);
    } else {
      horizontalBounds = calculateLeftHorizontalBounds(documentContainerElement, documentContainerWidth, style);
    }

    const bounds = { ...verticalBounds, ...horizontalBounds };

    // Ensure the popup cannot be dragged off the left edge of the screen
    bounds.left = Math.max(bounds.left, -style.left);

    // Ensure the popup cannot be dragged off the right edge of the screen
    const containerWidth = containerRef.current?.getBoundingClientRect().width || 0;
    const maxRightPosition = documentContainerWidth - style.left - containerWidth;
    bounds.right = Math.min(bounds.right, maxRightPosition);

    return bounds;
  }, [initialPosition, documentContainerWidth, documentContainerHeight, documentElement, documentContainerElement, calculateStyle]);

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  if (!initialPosition) {
    return {
      position,
      setPosition,
      handleDrag,
      handleStop,
    };
  }

  return {
    position,
    setPosition,
    handleDrag,
    handleStop,
    resetPosition,
    containerRef,
    style: calculateStyle(),
    bounds: containerBounds(),
  };
};

export default useDraggablePosition;
