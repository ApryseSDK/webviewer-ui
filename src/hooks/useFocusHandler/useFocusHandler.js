import { useDispatch } from 'react-redux';
import actions from 'actions';

const useFocusHandler = (handler) => {
  const dispatch = useDispatch();

  return (e) => {
    // If no event is passed, call the handler and return
    // we need the event for this hook to work, fix that on the consumer side
    if (!e) {
      handler();
      return;
    }

    const { nativeEvent } = e;

    if (nativeEvent.pointerType === 'mouse' || nativeEvent.detail > 0) {
      dispatch(actions.setFocusedElementsStack([]));
      dispatch(actions.setKeyboardOpen(false));
    } else if (nativeEvent.pointerType === '' || nativeEvent.pointerType === undefined) {
      dispatch(actions.pushFocusedElement(e.currentTarget));
      dispatch(actions.setKeyboardOpen(true));
    }

    handler(e);
  };
};

export default useFocusHandler;
