import { useEffect, useCallback } from 'react';
import { focusableElementDomString } from '@pdftron/webviewer-react-toolkit';
import { findFocusableIndex } from '../helpers/accessibility';

/**
 * Use arrows to focus within a menu.
 * @param {boolean} isOpen Is the menu currently open.
 * @param {Function} onClose Function to close menu. Must be memoized!
 * @param {HTMLElement} overlayRef The wrapper element for the menu.
 */
export default function useArrowFocus(isOpen, onClose, overlayRef) {
  const getFocusableElements = useCallback(() => {
    return overlayRef.current.querySelectorAll(focusableElementDomString);
  }, [overlayRef]);

  useEffect(() => {
    if (isOpen) {
      const lastFocusedElement = document.activeElement;

      const keydownListener = e => {
        // Tab and escape close the menu.
        if (e.key === 'Tab' || e.key === 'Escape') {
          onClose();
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

          let focusIndex = findFocusableIndex(focusable, document.activeElement);
          if (e.key === 'ArrowUp' && focusIndex === -1) {
            focusIndex = 0;
          }

          const vector = e.key === 'ArrowUp' ? -1 : 1;
          focusable[(focusIndex + vector + focusable.length) % focusable.length].focus();
          // User is "tabbing", so show button outlines.
          document.documentElement.setAttribute('data-tabbing', 'true');
        }
      };

      window.addEventListener('keydown', keydownListener);
      return () => window.removeEventListener('keydown', keydownListener);
    }
  }, [getFocusableElements, isOpen, onClose]);
}
