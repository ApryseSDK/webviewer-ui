import { useCallback } from 'react';
import getRootNode from 'helpers/getRootNode';
import FocusStackManager from 'helpers/focusStackManager';

// This hook is used to focus on the previously focused element when an element like a modal is closed
const useFocusOnClose = (onCloseClick) => {

  const onCloseHandler = useCallback((event) => {
    onCloseClick(event);
    const dataElement = FocusStackManager.pop();
    if (dataElement) {
      const elementToFocus = getRootNode().querySelector(`[data-element="${dataElement}"]`);
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
