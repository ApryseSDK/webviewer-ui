import { isIE11 } from 'helpers/device';
import Events from 'constants/events';
import { getInstanceNode } from 'helpers/getRootNode';

const fireEvent = (eventName, data, element = null) => {
  let event;
  if (CustomEvent && !isIE11) {
    event = new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true });
  } else {
    event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    event.detail = data;
  }
  element ? element.dispatchEvent(event) : getInstanceNode().dispatchEvent(event);
};

export default fireEvent;
export const fireError = (message) => {
  fireEvent(Events.LOAD_ERROR, message);
};
