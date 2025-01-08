import { isIE11 } from 'helpers/device';
import Events from 'constants/events';
import getRootNode, { getInstanceNode } from 'helpers/getRootNode';

const fireEvent = async (eventName, data, element = null) => {
  let event;
  if (CustomEvent && !isIE11) {
    if (eventName === Events.VISIBILITY_CHANGED && data.isVisible === true) {
      await new Promise((resolve) => {
        const selector = `[data-element="${data.element}"]`;
        let element = getRootNode().querySelector(selector);
        if (element) {
          return resolve();
        }
        const observer = new MutationObserver(() => {
          element = getRootNode().querySelector(selector);
          if (element) {
            observer.disconnect();
            resolve();
          }
        });
        observer.observe(getRootNode(), { childList: true, subtree: true });
      });
    }
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
