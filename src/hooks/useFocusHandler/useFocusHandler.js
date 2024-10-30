import FocusStackManager from 'helpers/focusStackManager';

const useFocusHandler = (handler) => {

  return (e) => {
    // If no event is passed, call the handler and return
    // we need the event for this hook to work, fix that on the consumer side
    if (!e) {
      handler();
      return;
    }

    const { nativeEvent } = e;
    // We store in a stack the dataElement of the button we want to focus when transferring focus back
    const dataElement = e.currentTarget.getAttribute('data-element');
    if (!dataElement) {
      console.warn('You used the useFocusHandler hook on an element without a data-element attribute. Please add a dataElement for the focus transfer to work correctly.');
      handler(e);
      return;
    }

    if (nativeEvent.pointerType === 'mouse' || nativeEvent.detail > 0) {
      FocusStackManager.clear();
    } else if (nativeEvent.pointerType === '' || nativeEvent.pointerType === undefined) {
      FocusStackManager.push(dataElement);
    }

    handler(e);
  };
};


export default useFocusHandler;
