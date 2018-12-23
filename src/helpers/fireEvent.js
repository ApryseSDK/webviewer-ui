import { isIE11 } from 'helpers/device';

const fireEvent = (eventName, data) => {
  let event;
  if (CustomEvent && !isIE11) {
    event = new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true });
  } else {
    event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    event.detail = data;
  }
  window.dispatchEvent(event);
};

export default fireEvent;
export const fireError = message => {
  fireEvent('loaderror', message);
};
