import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';

// This hook is used to focus on the previously focused element when an element like a modal is closed
const useFocusOnClose = (onCloseClick) => {
  const dispatch = useDispatch();

  const onCloseHandler = useCallback((event) => {
    onCloseClick(event);
    const focusedElement = dispatch(actions.popFocusedElement());
    if (focusedElement) {
      focusedElement.focus();
    }
  }, [onCloseClick]);

  return onCloseHandler;
};

export default useFocusOnClose;
