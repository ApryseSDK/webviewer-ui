import { useContext } from 'react';
import Events from 'constants/events';
import getRootNode from 'helpers/getRootNode';
import { createInstanceScopedState } from 'core/documentViewers';
import InstanceIdContext from 'src/context/InstanceIdContext';

// Private event used internally by the UI to route load errors to the
// active viewer/modal
export const INTERNAL_LOAD_ERROR_EVENT = '__ui_loaderror_internal__';

// One UI event bus per instance so instance.UI.addEventListener only hears its own instance's events.
const eventHandlers = createInstanceScopedState(() => new window.Core.EventHandler());

export const getEventHandler = (instanceId) => eventHandlers.get(instanceId);

/**
 * UI event bus for the instance that rendered the calling component. Effects run after React leaves that instance, so `getEventHandler()` inside an effect could resolve a sibling's bus.
 * @ignore
 */
export const useInstanceEventHandler = () => getEventHandler(useContext(InstanceIdContext) ?? undefined);

const triggerEventHandler = async (handler, eventName, data) => {
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
 * @param {number} [instanceId] Instance whose listeners receive the event. Defaults to the ambient instance; pass it when firing after an await or Core callback.
 */
const fireEvent = async (eventName, data, element, instanceId) => {
  const handler = getEventHandler(instanceId);
  // Special-case: wait for the visible element to mount before notifying listeners.
  // VISIBILITY_CHANGED args are [element, isVisible].
  if (eventName === Events.VISIBILITY_CHANGED && Array.isArray(data) && data[1] === true) {
    await new Promise((resolve) => {
      const root = getRootNode(instanceId);
      // No root registered yet (early startup or a destroyed instance): there is nothing to wait for.
      if (!root) {
        return resolve();
      }
      const selector = `[data-element="${data[0]}"]`;
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
    await triggerEventHandler(handler, eventName);
  } else if (Array.isArray(data)) {
    // EventHandler.triggerAsync spreads a single-array `data` argument as positional args to handlers.
    await triggerEventHandler(handler, eventName, data);
  } else {
    // Wrap non-array values so the EventHandler treats them as a single positional argument.
    await triggerEventHandler(handler, eventName, [data]);
  }

  window.dispatchEvent(new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true })); // For backward compatibility
};

export default fireEvent;

const createInternalLoadErrorPayload = (message, documentViewerId) => {
  if (message && typeof message === 'object') {
    return {
      error: message,
      ...message,
      message: message.message,
      documentViewerId: message.documentViewerId || documentViewerId,
    };
  }

  return {
    error: message,
    message,
    documentViewerId,
  };
};

export const fireError = (message, documentViewerId = '') => {
  // Public contract: preserve original loaderror payload shape.
  fireEvent(Events.LOAD_ERROR, message);

  // Internal modal routing: include viewer id metadata when available.
  fireEvent(INTERNAL_LOAD_ERROR_EVENT, createInternalLoadErrorPayload(message, documentViewerId));
};
