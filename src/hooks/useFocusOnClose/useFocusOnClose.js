import { useCallback } from 'react';
import getRootNode from 'helpers/getRootNode';
import FocusStackManager from 'helpers/focusStackManager';

// This hook is used to focus on the previously focused element when an element like a modal is closed
const useFocusOnClose = (onCloseClick, preferredFocusElement = '') => {

  const onCloseHandler = useCallback((event) => {
    onCloseClick(event);
    const dataElement = FocusStackManager.pop();
    const elementSelectorToFocus = preferredFocusElement || dataElement;
    if (elementSelectorToFocus) {
      const elementToFocus = getRootNode().querySelector(`[data-element="${elementSelectorToFocus}"]`);
      if (elementToFocus) {
        requestAnimationFrame(() => {
          elementToFocus.focus();
        });
      }
    }
  }, [onCloseClick]);

  return onCloseHandler;
};

export default useFocusOnClose;
