import Events from 'constants/events';
import getRootNode from 'helpers/getRootNode';

let eventHandler;

export const getEventHandler = () => {
  if (!eventHandler) {
    eventHandler = new window.Core.EventHandler();
  }
  return eventHandler;
};

const triggerEventHandler = async (eventName, data) => {
  const handler = getEventHandler();
  const trigger = handler.triggerAsync || handler.trigger;

  if (data === undefined) {
    await trigger.call(handler, eventName);
  } else {
    await trigger.call(handler, eventName, data);
  }
};

/**
 * Fire a UI event following the Core EventHandler convention.
 * @ignore
 * @param {string} eventName The name of the event to fire.
 * @param {*} [data] Array values are spread as positional args to listeners; non-array is a single arg; omit for no args.
 * @param {Element} [element] If provided, dispatches a CustomEvent on that element only (used for the web component `'ready'` event).
 */
const fireEvent = async (eventName, data, element = null) => {
  // Special-case: wait for the visible element to mount before notifying listeners.
  // VISIBILITY_CHANGED args are [element, isVisible].
  if (eventName === Events.VISIBILITY_CHANGED && Array.isArray(data) && data[1] === true) {
    await new Promise((resolve) => {
      const selector = `[data-element="${data[0]}"]`;
      const root = getRootNode();
      let mountedElement = root.querySelector(selector);
      if (mountedElement) {
        return resolve();
      }
      const observer = new MutationObserver(() => {
        mountedElement = root.querySelector(selector);
        if (mountedElement) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(root, { childList: true, subtree: true });
    });
  }

  if (element) {
    element.dispatchEvent(new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true }));
    return;
  }

  if (data === undefined) {
    await triggerEventHandler(eventName);
  } else if (Array.isArray(data)) {
    // EventHandler.triggerAsync spreads a single-array `data` argument as positional args to handlers.
    await triggerEventHandler(eventName, data);
  } else {
    // Wrap non-array values so the EventHandler treats them as a single positional argument.
    await triggerEventHandler(eventName, [data]);
  }

  window.dispatchEvent(new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true })); // For backward compatibility
};

export default fireEvent;
export const fireError = (message) => {
  fireEvent(Events.LOAD_ERROR, message);
};
