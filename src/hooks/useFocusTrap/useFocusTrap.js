import { useCallback, useEffect, useRef } from 'react';
import { useCurrentRef } from 'hooks/useCurrentRef';
import { findFocusableIndex } from 'helpers/accessibility';
import { getDOMActiveElement } from 'helpers/webComponent';

const focusableElementDomString = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
].join(',');

/**
 * @ignore
 * A hook for trapping focus within an element. Returns a ref which can be given
 * to any element to trap focus within that element when `locked` is true.
 * @param locked When true, focus will be locked within the element you passed
 * the returned ref to.
 * @param options Options to control the focus trap.
 */
export default function useFocusTrap(locked = false, options = {}) {
  const focusLastOnUnlock = options.focusLastOnUnlock;
  const focusRef = useRef(null);
  // Get the focusable elements. Assumes that focusRef exists. DON'T CALL if
  // you haven't asserted existance of focusRef.current.
  const getFocusableElements = useCallback(() => {
    return focusRef.current.querySelectorAll(focusableElementDomString);
  }, []);

  const isElementVisible = (element) => {
    if (!element) {
      return false;
    }
    // Check if the element or any of its parents has visibility:hidden or display:none
    while (element) {
      const style = window.getComputedStyle(element);
      if (style.visibility === 'hidden' || style.display === 'none') {
        return false;
      }
      element = element.parentElement;
    }
    return true;
  };

  const getLastVisibleIndex = (elementsArray) => {
    for (let i = elementsArray.length - 1; i >= 0; i--) {
      const element = elementsArray[i];

      if (isElementVisible(element)) {
        return i;
      }
    }
    return -1;
  };

  // Cycles tabs within the lock zone when enabled, or prevents default
  // if there are no elements within the lock (rare edge case).
  const lockFocus = useCallback((event) => {
    // Return if not locked, other key pressed, or no ref.
    if (!locked || (event && event.key !== 'Tab') || !focusRef.current) {
      return;
    }
    const focusableElements = getFocusableElements();

    // If no focusable elements, simply prevent tab default.
    if (!focusableElements.length) {
      return event?.preventDefault();
    }

    const activeElement = getDOMActiveElement();
    const focusedItemIndex = findFocusableIndex(focusableElements, activeElement);

    // If focused inside and initial call (no event), leave focused element.
    if (focusedItemIndex !== -1 && !event) {
      return;
    }

    const lastVisibleElementIndex = getLastVisibleIndex(focusableElements);
    // If focused outside, or tabbing past last element, cycle to beginning.
    if (focusedItemIndex === -1 || (!event?.shiftKey && focusedItemIndex === lastVisibleElementIndex)) {
      focusableElements[0].focus();
      return event?.preventDefault();
    }
    // If tabbing backwards and focusing first element, cycle to end.
    if (event?.shiftKey && focusedItemIndex === 0) {
      focusableElements[lastVisibleElementIndex].focus();
      return event?.preventDefault();
    }
  }, [getFocusableElements, locked]);

  const getTarget = (e) => {
    let target = e.target;
    if (target.shadowRoot) {
      target = e.composedPath()[0];
    }
    return target;
  };

  // Ensure that user can not focus outside of lock. If an attempt is made
  // and focusable elements exist inside, will focus first element inside.
  const checkFocus = useCallback((event) => {
    // Return if not locked or no focus ref.
    if (!locked || !focusRef.current) {
      return;
    }
    // Blur focus target if no focusable elements.
    const focusableElements = getFocusableElements();
    const target = getTarget(event);
    if (!focusableElements.length) {
      return target?.blur();
    }
    // Focus initial element if focused outside.
    const focusedItemIndex = findFocusableIndex(focusableElements, target);
    if (focusedItemIndex === -1) {
      return focusableElements[0].focus();
    }
  }, [getFocusableElements, locked]);

  // Add document listeners for lock focus and check focus
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    document.addEventListener('keydown', lockFocus);
    document.addEventListener('focusin', checkFocus);
    return () => {
      document.removeEventListener('keydown', lockFocus);
      document.removeEventListener('focusin', checkFocus);
    };
  }, [checkFocus, lockFocus]);

  // Keep the ref to focusLastOnUnlock fresh, prevents useEffect refresh.
  const focusLastOnUnlockRef = useCurrentRef(focusLastOnUnlock);

  // When locked is changed, will maybe store last element focused prior
  // to lock being enabled, and will call lockFocus to focus first element
  // if it exists. Returns when locked is disabled, and will focus prior
  // element if stored (return focus to previous element).
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let lastFocusedElement;
    if (locked) {
      const activeElement = getDOMActiveElement();
      if (focusLastOnUnlockRef.current && !focusRef.current?.contains(activeElement)) {
        lastFocusedElement = activeElement;
        lockFocus();
        return () => lastFocusedElement.focus();
      }
      lockFocus();
    }
  }, [focusLastOnUnlockRef, lockFocus, locked]);
  return focusRef;
}
