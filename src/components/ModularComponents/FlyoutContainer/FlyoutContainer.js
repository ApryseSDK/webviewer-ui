import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import { Swipeable } from 'react-swipeable';
import selectors from 'selectors';
import actions from 'actions';
import useFocusOnClose from 'hooks/useFocusOnClose';
import { DEFAULT_GAP, FLYOUT_BOUNDARY_PADDING, FLYOUT_MAX_HEIGHT_PADDING } from 'constants/customizationVariables';
import getRootNode from 'helpers/getRootNode';
import getAppRect from 'helpers/getAppRect';
import { getFlyoutPositionOnElement, isToggleScrolledOutOfAncestor } from 'helpers/flyoutHelper';
import { isMobileSize } from 'helpers/getDeviceSize';
import ErrorBoundaryComponent from 'components/ErrorBoundaryComponent';
import COMPONENT_TYPES from 'constants/componentTypes';
import Flyout from 'components/ModularComponents/Flyout';

const FlyoutContainer = () => {
  const dispatch = useDispatch();

  const flyoutMap = useSelector(selectors.getFlyoutMap, shallowEqual);
  const activeFlyout = useSelector(selectors.getActiveFlyout);
  const isFlyoutOpen = useSelector((state) => selectors.isElementOpen(state, activeFlyout), shallowEqual);
  const position = useSelector(selectors.getFlyoutPosition, shallowEqual);
  const toggleElement = useSelector(selectors.getFlyoutToggleElement);
  const topHeadersHeight = useSelector(selectors.getTopHeadersHeight);
  const bottomHeadersHeight = useSelector(selectors.getBottomHeadersHeight);
  const isInDesktopOnlyMode = useSelector((state) => selectors.isInDesktopOnlyMode(state));

  const isMobile = isMobileSize();
  const shouldUseMobileFlyout = isMobile && !isInDesktopOnlyMode;

  const dataElement = flyoutMap[activeFlyout]?.dataElement;
  const items = flyoutMap[activeFlyout]?.items;
  const horizontalHeadersUsedHeight = topHeadersHeight + bottomHeadersHeight + DEFAULT_GAP;

  const flyoutRef = useRef(null);
  const [correctedPosition, setCorrectedPosition] = useState(position);
  const [maxHeightValue, setMaxHeightValue] = useState(window.innerHeight - horizontalHeadersUsedHeight);
  const [shouldOverflow, setShouldOverflow] = useState(false);

  // Resolve the per-instance root from the flyout element itself. The module-level `rootNode` singleton in helpers/getRootNode.js is overwritten by whichever WebComponent called setRootNode last, so in multi-WC mode a keyless `getRootNode().querySelector(...)` returns the wrong instance's node and flyouts position themselves against the sibling instance.
  const getLocalRoot = () => flyoutRef.current?.getRootNode?.() || getRootNode();

  const getElementDOMRef = (dataElement) => {
    return getLocalRoot().querySelector(`[data-element="${dataElement}"]`);
  };

  const closeFlyout = useFocusOnClose(useCallback(() => {
    dispatch(actions.closeElements([activeFlyout]));
  }, [dispatch, activeFlyout]));

  const onSwipeDown = () => {
    if (shouldUseMobileFlyout) {
      closeFlyout();
    }
  };

  const calculateAndMaybeSetPosition = useCallback(() => {
    const refEl = getElementDOMRef(toggleElement);
    const app = getAppRect(getLocalRoot());
    // Keep max height in sync with the exact app rect used for positioning
    setMaxHeightValue(app.height - horizontalHeadersUsedHeight);
    const next = { x: position.x, y: position.y };

    if (toggleElement && refEl) {
      const { x, y } = getFlyoutPositionOnElement(toggleElement, flyoutRef);
      next.x = x;
      next.y = y;
    }

    const flyoutRect = flyoutRef.current?.getBoundingClientRect();
    if (flyoutRect && app) {
      const maxX = app.width - flyoutRect.width - FLYOUT_BOUNDARY_PADDING;
      const maxY = app.height - flyoutRect.height - FLYOUT_BOUNDARY_PADDING;
      if (next.x > maxX) {
        next.x = maxX;
      }
      if (next.y > maxY) {
        next.y = maxY;
      }
      if (next.x < FLYOUT_BOUNDARY_PADDING) {
        next.x = FLYOUT_BOUNDARY_PADDING;
      }
      if (next.y < FLYOUT_BOUNDARY_PADDING) {
        next.y = FLYOUT_BOUNDARY_PADDING;
      }
    }

    setCorrectedPosition((prev) => {
      if (!prev || prev.x !== next.x || prev.y !== next.y) {
        return next;
      }
      return prev;
    });
  }, [position, toggleElement, horizontalHeadersUsedHeight]);

  const calculateOverflow = useCallback(() => {
    const appRect = getAppRect(getLocalRoot());
    const flyoutRect = flyoutRef.current?.getBoundingClientRect();
    let isChildOverflowing = false;
    const flyoutChildren = flyoutRef?.current?.firstChild?.children;
    if (flyoutChildren) {
      for (let child of flyoutChildren) {
        if (child.getBoundingClientRect().bottom > flyoutRect.bottom) {
          isChildOverflowing = true;
          break;
        }
      }
    }
    setShouldOverflow(appRect && flyoutRect && appRect.height > 0 && (flyoutRect.height > appRect.height || isChildOverflowing));
  }, []);

  // Exposed to Flyout so its content changes (submenu navigation, typing) can retrigger placement/overflow without lifting that content state out of Flyout.
  const recalculatePlacement = useCallback(() => {
    requestAnimationFrame(() => {
      calculateAndMaybeSetPosition();
      calculateOverflow();
    });
  }, [calculateAndMaybeSetPosition, calculateOverflow]);

  useLayoutEffect(() => {
    const tempRefElement = getElementDOMRef(toggleElement);

    // Check if the element is in the DOM or invisible
    if (tempRefElement?.offsetParent === null) {
      return;
    }

    // Run once now and once on the next frame to catch late layout
    if (flyoutRef.current) {
      calculateAndMaybeSetPosition();
      requestAnimationFrame(calculateAndMaybeSetPosition);
    }

    let resizeObserver;

    if (typeof ResizeObserver !== 'undefined' && flyoutRef.current) {
      resizeObserver = new ResizeObserver(() => {
        calculateAndMaybeSetPosition();
      });
      resizeObserver.observe(flyoutRef.current);
    }

    // Reposition the flyout when something inside the WebViewer scrolls (e.g. Notes Panel scrolling through comments)
    const localRoot = getLocalRoot();
    const onScroll = (e) => {
      const target = e.target;
      // Ignore the flyout's own overflow menu scrolling itself
      if (target?.nodeType === 1 && flyoutRef.current?.contains(target)) {
        return;
      }
      // Close the flyout if the toggle button has scrolled out of view of its scrolling ancestor (e.g. it scrolled behind the NotesPanelHeader)
      const toggle = getElementDOMRef(toggleElement);
      if (toggle && isToggleScrolledOutOfAncestor(toggle, target)) {
        closeFlyout();
        return;
      }
      calculateAndMaybeSetPosition();
    };
    localRoot?.addEventListener('scroll', onScroll, true);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      localRoot?.removeEventListener('scroll', onScroll, true);
    };
  }, [position, items, toggleElement, isFlyoutOpen, calculateAndMaybeSetPosition, closeFlyout]);

  useLayoutEffect(() => {
    calculateOverflow();
  }, [position, items, calculateOverflow]);

  const flyoutStyles = {
    left: correctedPosition.x,
    top: correctedPosition.y,
    maxHeight: maxHeightValue - FLYOUT_MAX_HEIGHT_PADDING, // Subtracting padding so the flyout doesn't touch the app boundary
  };

  if (!activeFlyout || !flyoutMap[activeFlyout]) {
    return null;
  }

  return (
    isFlyoutOpen &&
    <Swipeable onSwipedDown={onSwipeDown} trackMouse preventDefaultTouchmoveEvent>
      <div
        className={classNames({
          'Flyout': true,
          'mobile': shouldUseMobileFlyout,
        })}
        data-element={dataElement}
        ref={flyoutRef}
        css={shouldUseMobileFlyout ? undefined : flyoutStyles}
      >
        {shouldUseMobileFlyout && <div className="swipe-indicator" />}
        <ErrorBoundaryComponent
          dataElement={activeFlyout}
          componentType={COMPONENT_TYPES.FLYOUT}
        >
          <Flyout
            flyoutRef={flyoutRef}
            shouldOverflow={shouldOverflow}
            recalculatePlacement={recalculatePlacement}
          />
        </ErrorBoundaryComponent>
      </div>
    </Swipeable>
  );
};

export default FlyoutContainer;
