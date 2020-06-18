import { focusableElementDomString } from '@pdftron/webviewer-react-toolkit';
import actions from 'actions';
import classNames from 'classnames';
import { findFocusableIndex } from 'helpers/accessibility';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import useMedia from 'hooks/useMedia';
import useOnClickOutside from 'hooks/useOnClickOutside';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swipeable } from 'react-swipeable';
import selectors from 'selectors';
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
};

function FlyoutMenu({ menu, trigger, onClose, children }) {
  const dispatch = useDispatch();

  const allOtherMenus = useMemo(() => MENUS.filter(m => m !== menu), [menu]);

  const overlayRef = useRef();
  const getFocusableElements = useCallback(() => {
    return overlayRef.current.querySelectorAll(focusableElementDomString);
  }, []);

  const isDisabled = useSelector(state => selectors.isElementDisabled(state, menu));
  const isOpen = useSelector(state => selectors.isElementOpen(state, menu));

  const closeMenu = useCallback(() => {
    dispatch(actions.closeElements([menu]));
    onClose && onClose();
  }, [dispatch, menu, onClose]);

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

  // When open: close others, position, and listen for resizes to position.
  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements(allOtherMenus));

      const onResize = () => setPosition(getOverlayPositionBasedOn(trigger, overlayRef, isTabletOrMobile));
      onResize();

      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, [allOtherMenus, dispatch, isOpen, isTabletOrMobile, trigger]);

  // When menu opens, focus will be controlled internally with Up/Down arrows.
  // Will return focus to button that opened it once it closes.
  useEffect(() => {
    if (!isDisabled && isOpen) {
      const lastFocusedElement = document.activeElement;

      const keydownListener = e => {
        // Tab closes the menu.
        if (e.key === 'Tab' || e.key === 'Escape') {
          e.preventDefault();
          closeMenu();
          if (lastFocusedElement) {
            lastFocusedElement.focus();
          }
          return;
        }

        // Up and Down keys used to navigate overlay menu.
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          const focusable = getFocusableElements();

          if (focusable.length === 0) {
            return;
          }

          const focusIndex = findFocusableIndex(focusable, document.activeElement);

          const vector = e.key === 'ArrowUp' ? -1 : 1;
          focusable[(focusIndex + vector + focusable.length) % focusable.length].focus();
        }
      };

      window.addEventListener('keydown', keydownListener);
      return () => window.removeEventListener('keydown', keydownListener);
    }
  }, [closeMenu, getFocusableElements, isDisabled, isOpen]);

  if (isDisabled) {
    return null;
  }

  const overlayClass = classNames('Overlay', 'FlyoutMenu', {
    mobile: isMobile,
    closed: !isOpen,
  });

  return (
    <Swipeable onSwipedUp={closeMenu} onSwipedDown={closeMenu} preventDefaultTouchmoveEvent>
      <div className={overlayClass} data-element={menu} style={!isMobile ? position : undefined} ref={overlayRef}>
        {isMobile && <div className="swipe-indicator" />}
        {children}
      </div>
    </Swipeable>
  );
}

FlyoutMenu.propTypes = propTypes;
export default FlyoutMenu;
