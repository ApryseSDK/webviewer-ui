import { useState, useRef, useCallback, useMemo, useLayoutEffect, useEffect } from 'react';
import core from 'core';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

export const DEFAULTS = {
  CONTAINER_TOP_OFFSET: 85,
  CONTAINER_RIGHT_OFFSET: 35,
  WIDTH_RATIO: 0.666,
  DISTANCE: 10,
  FALLBACK_HEIGHT: 400,
};

/**
 * @ignore
 * Splits the initial position string into vertical/horizontal tokens.
 * Possible values: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 */
const parseInitialPosition = (initialPosition) => {
  if (!initialPosition) {
    return { verticalPosition: null, horizontalPosition: null };
  }
  const [verticalPosition, horizontalPosition] = initialPosition.split('-');
  return { verticalPosition, horizontalPosition };
};

/**
 * @ignore
 * Safely measures the overlay element, returning 0s when no node is present.
 */
const getOverlaySize = (elementOrRef) => {
  const node = elementOrRef?.current ?? elementOrRef;
  if (!node || typeof node.getBoundingClientRect !== 'function') {
    return { width: 0, height: 0 };
  }
  const { width, height } = node.getBoundingClientRect();
  return { width, height };
};

/**
 * @ignore
 * Calculates the top offset so the overlay sits inside the document container.
 */
const calculateTopOffset = (verticalPosition, overlayHeight, documentOffsetTop, documentContainerHeight, documentContainerTop) => {
  if (verticalPosition === 'top') {
    return documentOffsetTop + DEFAULTS.DISTANCE || DEFAULTS.CONTAINER_TOP_OFFSET;
  }

  const height = overlayHeight || DEFAULTS.FALLBACK_HEIGHT;
  return documentContainerHeight + documentContainerTop - DEFAULTS.DISTANCE - height || DEFAULTS.CONTAINER_TOP_OFFSET;
};

/**
 * @ignore
 * Calculates left offset when the overlay is initially anchored to the right.
 */
const calculateRightOffset = (documentContainerWidth, documentContainerLeft, documentOffsetLeft, documentOffsetWidth, overlayWidth) => {
  let offset = documentContainerLeft + (documentContainerWidth * DEFAULTS.WIDTH_RATIO);

  if (!overlayWidth) {
    return offset;
  }

  const rightEdgePosition = documentOffsetLeft + documentOffsetWidth + DEFAULTS.DISTANCE || offset;
  const maxAllowedPosition = documentContainerLeft + documentContainerWidth + overlayWidth - DEFAULTS.DISTANCE;
  return Math.min(rightEdgePosition, maxAllowedPosition);
};

/**
 * @ignore
 * Calculates left offset when the overlay is initially anchored to the left.
 */
const calculateLeftOffset = (documentOffsetLeft, overlayWidth, documentContainerLeft) => {
  if (!overlayWidth) {
    return DEFAULTS.DISTANCE;
  }

  let offset = documentOffsetLeft - DEFAULTS.DISTANCE - overlayWidth || DEFAULTS.DISTANCE;

  if (offset < documentContainerLeft) {
    offset = documentContainerLeft + DEFAULTS.DISTANCE;
  }

  if (!offset || isNaN(offset) || offset < 0) {
    offset = DEFAULTS.DISTANCE;
  }

  return offset;
};

/**
 * @ignore
 * Returns vertical drag bounds based on initial vertical anchor.
 */
const calculateVerticalBounds = (verticalPosition, documentContainerHeight, overlayHeight) => {
  const base = { top: 0, bottom: documentContainerHeight - (DEFAULTS.DISTANCE * 2) };

  if (verticalPosition === 'top') {
    base.bottom -= overlayHeight || DEFAULTS.CONTAINER_TOP_OFFSET;
    return base;
  }

  if (verticalPosition === 'bottom') {
    return {
      top: -documentContainerHeight + (DEFAULTS.DISTANCE * 2) + (overlayHeight || DEFAULTS.CONTAINER_TOP_OFFSET),
      bottom: 0,
    };
  }

  console.warn(`Invalid vertical position: ${verticalPosition}. Defaulting to top bounds.`);
  base.bottom -= DEFAULTS.CONTAINER_TOP_OFFSET;
  return base;
};

/**
 * @ignore
 * Returns horizontal drag bounds when starting on the right side.
 */
const calculateRightHorizontalBounds = (documentContainerLeft, documentContainerWidth, initialOffsetLeft) => {
  const bounds = { left: -(documentContainerWidth + documentContainerLeft), right: documentContainerWidth / 3 };
  bounds.right = documentContainerLeft + documentContainerWidth - initialOffsetLeft;
  return bounds;
};

/**
 * @ignore
 * Returns horizontal drag bounds when starting on the left side.
 */
const calculateLeftHorizontalBounds = (documentContainerLeft, documentContainerWidth, initialOffsetLeft) => {
  const containerLeft = documentContainerLeft;
  const bounds = {
    left: containerLeft,
    right: documentContainerWidth - DEFAULTS.DISTANCE - DEFAULTS.CONTAINER_RIGHT_OFFSET
  };

  bounds.left = Math.max(0, containerLeft - initialOffsetLeft + DEFAULTS.DISTANCE);
  bounds.right -= initialOffsetLeft;

  return bounds;
};

/**
 * @ignore
 * Derives the initial inline offset from inputs and sizing. Returned offsets are later clamped to keep the overlay visible.
 */
const calculateInitialOffset = ({
  verticalPosition,
  horizontalPosition,
  overlayWidth,
  overlayHeight,
  documentOffsetTop,
  documentOffsetLeft,
  documentOffsetWidth,
  documentContainerTop,
  documentContainerWidth,
  documentContainerHeight,
  documentContainerLeft,
}) => {
  const offset = { left: 0, top: 0 };
  offset.top = calculateTopOffset(verticalPosition, overlayHeight, documentOffsetTop, documentContainerHeight, documentContainerTop);

  if (horizontalPosition === 'right') {
    offset.left = calculateRightOffset(documentContainerWidth, documentContainerLeft, documentOffsetLeft, documentOffsetWidth, overlayWidth);
  } else {
    offset.left = calculateLeftOffset(documentOffsetLeft, overlayWidth, documentContainerLeft);
  }

  return offset;
};

/**
 * @ignore
 * Builds the final drag bounds, clamping so the overlay cannot leave the container.
 */
const calculateDragBounds = ({
  verticalPosition,
  horizontalPosition,
  overlayWidth,
  overlayHeight,
  documentContainerLeft,
  documentContainerWidth,
  documentContainerHeight,
  initialOffsetLeft,
}) => {
  const verticalBounds = calculateVerticalBounds(verticalPosition, documentContainerHeight, overlayHeight);

  let horizontalBounds;
  if (horizontalPosition === 'right') {
    horizontalBounds = calculateRightHorizontalBounds(documentContainerLeft, documentContainerWidth, initialOffsetLeft);
  } else {
    horizontalBounds = calculateLeftHorizontalBounds(documentContainerLeft, documentContainerWidth, initialOffsetLeft);
  }

  const bounds = { ...verticalBounds, ...horizontalBounds };
  bounds.left = Math.max(bounds.left, -initialOffsetLeft);

  const maxRightPosition = documentContainerLeft + documentContainerWidth - initialOffsetLeft - overlayWidth;
  bounds.right = Math.min(bounds.right, maxRightPosition);

  return bounds;
};

/**
 * @ignore
 * Clamps a proposed offset so the overlay stays within the visible container.
 */
const clampOffsetToContainer = (offset, {
  containerLeft,
  containerTop,
  containerWidth,
  containerHeight,
  overlayWidth,
  overlayHeight,
}) => {
  const minLeft = containerLeft + DEFAULTS.DISTANCE;
  const maxLeft = containerLeft + Math.max(0, containerWidth - overlayWidth - DEFAULTS.DISTANCE);
  const minTop = containerTop + DEFAULTS.DISTANCE;
  const maxTop = containerTop + Math.max(0, containerHeight - overlayHeight - DEFAULTS.DISTANCE);

  return {
    left: Math.min(Math.max(offset.left, minLeft), maxLeft),
    top: Math.min(Math.max(offset.top, minTop), maxTop),
  };
};

/**
 * @ignore
 * Hook that returns positioning/bounds helpers to make an overlay draggable within the document container.
 * Behavior: waits for usable measurements, computes an initial offset, clamps it to the container,
 * and freezes it after the first measurement; refreezes when container size changes.
 *
 * Returns:
 * - position: current drag position for controlled Draggable usage.
 * - setPosition: setter for position.
 * - handleDrag/handleStop: callbacks to update position during drag/stop.
 * - resetPosition: resets controlled position to {x: 0, y: 0}.
 * - containerRef/setOverlayRef: refs used to measure the overlay element.
 * - initialOffset: inline style (left/top) for the starting position.
 * - dragBounds: bounds object suitable for Draggable `bounds` prop.
 */
const useDraggablePosition = (initialPosition) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef(null);
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  const [frozenOffset, setFrozenOffset] = useState(null);
  const frozenContainerSize = useRef(null);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(!!core.getDocument?.());

  const documentContainerWidth = useSelector(selectors.getDocumentContainerWidth);
  const documentContainerHeight = useSelector(selectors.getDocumentContainerHeight);

  const documentContainerElement = core.getScrollViewElement();
  const documentElement = core.getViewerElement();

  /**
   * @ignore
   * Measures the overlay and only updates state when the size actually changes.
   */
  const measureOverlay = useCallback((node) => {
    setOverlaySize((prev) => {
      const next = getOverlaySize(node);
      if (prev.width === next.width && prev.height === next.height) {
        return prev;
      }
      return next;
    });
  }, []);

  /**
   * @ignore
   * Stores the overlay ref and eagerly measures it.
   */
  const setOverlayRef = useCallback((node) => {
    overlayRef.current = node;
    if (node) {
      measureOverlay(node);
    }
  }, [measureOverlay]);

  useLayoutEffect(() => {
    measureOverlay(overlayRef);
  }, [documentContainerWidth, documentContainerHeight, initialPosition, documentContainerElement, measureOverlay]);

  useEffect(() => {
    const onDocumentLoaded = () => setIsDocumentLoaded(true);
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => core.removeEventListener('documentLoaded', onDocumentLoaded);
  }, []);

  const handleDrag = useCallback((e, { x, y }) => {
    setPosition({ x, y });
  }, []);

  const handleStop = useCallback((e, { x, y }) => {
    setPosition({ x, y });
  }, []);

  const parsedInitialPosition = useMemo(() => parseInitialPosition(initialPosition), [initialPosition]);

  const containerRect = documentContainerElement?.getBoundingClientRect?.();
  const containerMetrics = {
    left: documentContainerElement?.offsetLeft || 0,
    top: documentContainerElement?.offsetTop || 0,
    width: documentContainerWidth || containerRect?.width || 0,
    height: documentContainerHeight || containerRect?.height || 0,
  };

  const documentMetrics = {
    left: documentElement?.offsetLeft || containerMetrics.left,
    top: documentElement?.offsetTop || containerMetrics.top,
    width: documentElement?.offsetWidth || containerMetrics.width,
    height: documentElement?.offsetHeight || containerMetrics.height,
  };

  const overlayWidth = overlaySize.width || 0;
  const overlayHeight = overlaySize.height || 0;

  const calculatedInitialOffset = useMemo(() => {
    if (!initialPosition) {
      return { left: 0, top: 0 };
    }

    const { verticalPosition, horizontalPosition } = parsedInitialPosition;

    const rawOffset = calculateInitialOffset({
      verticalPosition,
      horizontalPosition,
      overlayWidth,
      overlayHeight,
      documentOffsetTop: documentMetrics.top,
      documentOffsetLeft: documentMetrics.left,
      documentOffsetWidth: documentMetrics.width,
      documentContainerTop: containerMetrics.top,
      documentContainerWidth: containerMetrics.width,
      documentContainerHeight: containerMetrics.height,
      documentContainerLeft: containerMetrics.left,
    });
    return clampOffsetToContainer(rawOffset, {
      containerLeft: containerMetrics.left,
      containerTop: containerMetrics.top,
      containerWidth: containerMetrics.width,
      containerHeight: containerMetrics.height,
      overlayWidth,
      overlayHeight,
    });
  }, [
    initialPosition,
    parsedInitialPosition,
    overlayWidth,
    overlayHeight,
    containerMetrics.left,
    containerMetrics.top,
    containerMetrics.width,
    containerMetrics.height,
    documentMetrics.left,
    documentMetrics.top,
    documentMetrics.width,
  ]);

  useEffect(() => {
    // Reset the frozen offset if the desired initial position changes.
    setFrozenOffset(null);
  }, [initialPosition]);

  useLayoutEffect(() => {
    if (frozenOffset || !initialPosition) {
      return;
    }

    const hasOverlay = overlayWidth > 0 && overlayHeight > 0;
    const hasDocumentMetrics = documentMetrics.width > 0 && documentMetrics.height > 0;
    const hasContainerMetrics = containerMetrics.width > 0 && containerMetrics.height > 0;
    const readyToFreeze = hasOverlay && hasDocumentMetrics && hasContainerMetrics && isDocumentLoaded;
    if (!readyToFreeze) {
      return;
    }

    setFrozenOffset(calculatedInitialOffset);
    frozenContainerSize.current = {
      width: containerMetrics.width,
      height: containerMetrics.height,
    };
  }, [frozenOffset, initialPosition, calculatedInitialOffset, overlayWidth, overlayHeight, documentMetrics.width, documentMetrics.height, containerMetrics.width, containerMetrics.height, isDocumentLoaded]);

  useLayoutEffect(() => {
    if (!frozenOffset || !frozenContainerSize.current) {
      return;
    }
    const { width, height } = frozenContainerSize.current;
    if (width !== containerMetrics.width || height !== containerMetrics.height) {
      setFrozenOffset(null);
      frozenContainerSize.current = null;
    }
  }, [frozenOffset, containerMetrics.width, containerMetrics.height]);

  const initialOffset = frozenOffset || calculatedInitialOffset;

  const dragBounds = useMemo(() => {
    if (!initialPosition) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const { verticalPosition, horizontalPosition } = parsedInitialPosition;

    return calculateDragBounds({
      verticalPosition,
      horizontalPosition,
      overlayWidth,
      overlayHeight,
      documentContainerWidth: containerMetrics.width,
      documentContainerHeight: containerMetrics.height,
      documentContainerLeft: containerMetrics.left,
      initialOffsetLeft: initialOffset.left,
    });
  }, [
    initialPosition,
    parsedInitialPosition,
    overlayWidth,
    overlayHeight,
    containerMetrics.width,
    containerMetrics.height,
    containerMetrics.left,
    initialOffset.left,
  ]);

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
    containerRef: overlayRef,
    setOverlayRef,
    initialOffset,
    dragBounds,
  };
};

export { clampOffsetToContainer };
export default useDraggablePosition;
