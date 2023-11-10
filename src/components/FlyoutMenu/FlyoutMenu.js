import actions from 'actions';
import classNames from 'classnames';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import { isMobileSize, isTabletAndMobileSize } from 'helpers/getDeviceSize';
import useOnClickOutside from 'hooks/useOnClickOutside';
import PropTypes from 'prop-types';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swipeable } from 'react-swipeable';
import selectors from 'selectors';
import useArrowFocus from '../../hooks/useArrowFocus';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';
import './FlyoutMenu.scss';

const MENUS = [
  DataElements.MENU_OVERLAY,
  'groupOverlay',
  DataElements.VIEW_CONTROLS_OVERLAY,
  'searchOverlay',
  'signatureOverlay',
  DataElements.ZOOM_OVERLAY,
  'zoomOverlay1',
  'zoomOverlay2',
  'redactionOverlay',
  'toolStylePopup',
  DataElements.PAGE_MANIPULATION_OVERLAY,
  DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP,
  DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP_SMALL,
  'tabMenu',
];

const TRIGGERS = [
  DataElements.MENU_OVERLAY_BUTTON,
  DataElements.VIEW_CONTROLS_OVERLAY_BUTTON,
  DataElements.ZOOM_OVERLAY_BUTTON,
  'zoomOverlayButton1',
  'zoomOverlayButton2',
  DataElements.PAGE_MANIPULATION_OVERLAY_BUTTON,
  DataElements.THUMBNAILS_CONTROL_ROTATE_POPUP_TRIGGER,
  DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP_TRIGGER,
  DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP_SMALL_TRIGGER,
  'tabTrigger',
];

const propTypes = {
  /** Menu must be one of the available menus. */
  menu: PropTypes.oneOf(MENUS).isRequired,
  /** The button that triggered the menu. */
  trigger: PropTypes.oneOf(TRIGGERS).isRequired,
  /** The menu content. */
  children: PropTypes.node.isRequired,
  /** Fired when the menu is closed. */
  onClose: PropTypes.func,
  /** Accessibility */
  ariaLabel: PropTypes.string,
};

const viewerHeight = window.isApryseWebViewerWebComponent ? getRootNode()?.host.clientHeight : window.innerHeight;

function FlyoutMenu({ menu, trigger, onClose, children, ariaLabel }) {
  const dispatch = useDispatch();

  const allOtherMenus = useMemo(() => MENUS.filter((m) => m !== menu), [menu]);

  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, menu));
  const isOpen = useSelector((state) => selectors.isElementOpen(state, menu));

  const isInDesktopOnlyMode = useSelector((state) => selectors.isInDesktopOnlyMode(state));
  const pageManipulationOverlayAlternativePosition = useSelector((state) => selectors.getPageManipulationOverlayAlternativePosition(state),
  );

  const closeMenu = useCallback(() => {
    dispatch(actions.closeElements([menu]));
    onClose && onClose();
  }, [dispatch, menu, onClose]);

  const overlayRef = useRef(null);
  useArrowFocus(!isDisabled && isOpen, closeMenu, overlayRef);

  const onClickOutside = useCallback(
    (e) => {
      const menuButton = getRootNode().querySelector(`[data-element="${trigger}"]`);
      const clickedMenuButton = menuButton?.contains(e.target);
      if (!clickedMenuButton) {
        closeMenu();
      }
    },
    [closeMenu, trigger],
  );
  useOnClickOutside(overlayRef, onClickOutside);

  const [position, setPosition] = useState(() => ({ left: 0, right: 'auto', top: 'auto' }));
  const isMobile = isMobileSize();
  const isTabletAndMobile = isTabletAndMobileSize();

  const getAlternativePosition = () => {
    const alternativePosition = pageManipulationOverlayAlternativePosition;
    const verticalGap = isMobile && isTabletAndMobile ? 14 : 6;
    const clickTop = alternativePosition.top;
    let top = clickTop + verticalGap;
    if (clickTop > 100) {
      const flyoutMenuHeight = overlayRef.current.clientHeight;
      /**
       * if the right-click click was not on the top of the page, we should check if the popup will fit on the
       * the viewport and, if not, can adjust its position to "pass" the click position, otherwise the popup should always be below them
       */
      if (clickTop + flyoutMenuHeight > viewerHeight) {
        const calculatedTop = viewerHeight - flyoutMenuHeight - verticalGap;
        top = calculatedTop > 0 ? calculatedTop : 0;
        alternativePosition.top = top;
      }
    }

    return alternativePosition;
  };

  // When open: close others, position, and listen for resizes to position.
  // Uselayouteffect prevents "jumpy" behaviour from opening in old position and immediately repositioning the flyout
  useLayoutEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements(allOtherMenus));

      const onResize = () => {
        let overlayAlternativePosition;

        if (trigger === DataElements.PAGE_MANIPULATION_OVERLAY_BUTTON && pageManipulationOverlayAlternativePosition) {
          overlayAlternativePosition = getAlternativePosition();
        } else {
          overlayAlternativePosition = getOverlayPositionBasedOn(trigger, overlayRef, isMobile && isTabletAndMobile);
          overlayAlternativePosition.maxHeight = viewerHeight - overlayAlternativePosition.top;
        }
        setPosition(overlayAlternativePosition);
      };
      onResize();

      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, [allOtherMenus, dispatch, isOpen, isTabletAndMobile, trigger, isMobile]);

  if (isDisabled) {
    return null;
  }

  const overlayClass = classNames('Overlay', 'FlyoutMenu', {
    mobile: isMobile && !isInDesktopOnlyMode,
    closed: !isOpen,
  });

  return (
    <Swipeable onSwipedUp={closeMenu} onSwipedDown={closeMenu} preventDefaultTouchmoveEvent>
      <div
        className={overlayClass}
        data-element={menu}
        style={!isMobile || isInDesktopOnlyMode ? position : undefined}
        ref={overlayRef}
        role="listbox"
        aria-label={ariaLabel}
      >
        {isMobile && !isInDesktopOnlyMode && <div className="swipe-indicator" />}
        {children}
      </div>
    </Swipeable>
  );
}

FlyoutMenu.propTypes = propTypes;
export default FlyoutMenu;
