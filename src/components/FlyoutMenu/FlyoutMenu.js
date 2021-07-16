import actions from 'actions';
import classNames from 'classnames';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import useMedia from 'hooks/useMedia';
import useOnClickOutside from 'hooks/useOnClickOutside';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swipeable } from 'react-swipeable';
import selectors from 'selectors';
import useArrowFocus from '../../hooks/useArrowFocus';
import './FlyoutMenu.scss';

const MENUS = [
  'menuOverlay',
  'groupOverlay',
  'viewControlsOverlay',
  'searchOverlay',
  'signatureOverlay',
  'zoomOverlay',
  'redactionOverlay',
  'toolStylePopup',
];

const TRIGGERS = ['menuButton', 'viewControlsButton', 'zoomOverlayButton'];

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

function FlyoutMenu({ menu, trigger, onClose, children, ariaLabel }) {
  const dispatch = useDispatch();

  const allOtherMenus = useMemo(() => MENUS.filter(m => m !== menu), [menu]);

  const isDisabled = useSelector(state => selectors.isElementDisabled(state, menu));
  const isOpen = useSelector(state => selectors.isElementOpen(state, menu));

  const isInDesktopOnlyMode = useSelector(state => selectors.isInDesktopOnlyMode(state));

  const closeMenu = useCallback(() => {
    dispatch(actions.closeElements([menu]));
    onClose && onClose();
  }, [dispatch, menu, onClose]);

  const overlayRef = useRef(null);
  useArrowFocus(!isDisabled && isOpen, closeMenu, overlayRef);

  const onClickOutside = useCallback(
    e => {
      const menuButton = document.querySelector(`[data-element="${trigger}"]`);
      const clickedMenuButton = menuButton?.contains(e.target);
      if (!clickedMenuButton) {
        closeMenu();
      }
    },
    [closeMenu, trigger],
  );
  useOnClickOutside(overlayRef, onClickOutside);

  const [position, setPosition] = useState(() => ({ left: 0, right: 'auto', top: 'auto' }));
  const isMobile = useMedia(['(max-width: 640px)'], [true], false);
  const isTabletOrMobile = useMedia(['(max-width: 900px)'], [true], false);
  const isSmallBrowserHeight = useMedia(['(max-height: 500px)'], [true], false);

  // When open: close others, position, and listen for resizes to position.
  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements(allOtherMenus));

      const onResize = () => {
        const overlayPosition = getOverlayPositionBasedOn(trigger, overlayRef, isMobile && isTabletOrMobile);

        if (isSmallBrowserHeight) {
          overlayPosition.top = 0;
        }

        setPosition(overlayPosition);
      };
      onResize();

      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, [allOtherMenus, dispatch, isOpen, isTabletOrMobile, trigger, isSmallBrowserHeight, isMobile]);

  if (isDisabled) {
    return null;
  }

  const overlayClass = classNames('Overlay', 'FlyoutMenu', {
    mobile: isMobile && !isInDesktopOnlyMode,
    closed: !isOpen,
  });

  return (
    <Swipeable onSwipedUp={closeMenu} onSwipedDown={closeMenu} preventDefaultTouchmoveEvent>
      <div className={overlayClass} data-element={menu} style={(!isMobile || isInDesktopOnlyMode) ? position : undefined} ref={overlayRef} role="listbox" aria-label={ariaLabel}>
        {isMobile && !isInDesktopOnlyMode && <div className="swipe-indicator" />}
        {children}
      </div>
    </Swipeable>
  );
}

FlyoutMenu.propTypes = propTypes;
export default FlyoutMenu;
