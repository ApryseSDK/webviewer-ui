import { registerAppLifecycleResources, subscribeToMediaQuery } from './appLifecycle';

describe('registerAppLifecycleResources', () => {
  let visibilityStateDescriptor;

  beforeEach(() => {
    jest.useFakeTimers();
    visibilityStateDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState');
  });

  afterEach(() => {
    if (visibilityStateDescriptor) {
      Object.defineProperty(document, 'visibilityState', visibilityStateDescriptor);
    } else {
      delete document.visibilityState;
    }
    document.body.replaceChildren();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should remove browser resources and pending work when the app unmounts', () => {
    const removeEventHandlers = jest.fn();
    const closeOverlays = jest.fn();
    const messageHandler = jest.fn();
    const viewerLoadedCallback = jest.fn();
    const documentLoadCallback = jest.fn();
    const loadInitialDocument = jest.fn();
    const webComponentHost = {};
    const viewerLoadedTimeout = setTimeout(viewerLoadedCallback, 300);
    const documentLoadTimeout = setTimeout(documentLoadCallback, 500);
    const focusedElement = document.body.appendChild(document.createElement('button'));
    focusedElement.focus();
    const blur = jest.spyOn(focusedElement, 'blur');
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });

    const cleanup = registerAppLifecycleResources({
      removeEventHandlers,
      closeOverlays,
      messageHandler,
      viewerLoadedTimeout,
      documentLoadTimeout,
      webComponentHost,
      loadInitialDocument,
    });

    window.dispatchEvent(new Event('blur'));
    window.dispatchEvent(new MessageEvent('message'));
    document.dispatchEvent(new Event('visibilitychange'));

    expect(closeOverlays).toHaveBeenCalledTimes(1);
    expect(messageHandler).toHaveBeenCalledTimes(1);
    expect(blur).toHaveBeenCalledTimes(1);
    expect(webComponentHost.loadInitialDocument).toBe(loadInitialDocument);

    cleanup();
    window.dispatchEvent(new Event('blur'));
    window.dispatchEvent(new MessageEvent('message'));
    document.dispatchEvent(new Event('visibilitychange'));
    jest.runOnlyPendingTimers();

    expect(removeEventHandlers).toHaveBeenCalledTimes(1);
    expect(closeOverlays).toHaveBeenCalledTimes(1);
    expect(messageHandler).toHaveBeenCalledTimes(1);
    expect(blur).toHaveBeenCalledTimes(1);
    expect(viewerLoadedCallback).not.toHaveBeenCalled();
    expect(documentLoadCallback).not.toHaveBeenCalled();
    expect(webComponentHost).not.toHaveProperty('loadInitialDocument');
  });

  it('should preserve a host callback replaced by a newer app instance', () => {
    const webComponentHost = {};
    const replacement = jest.fn();
    const cleanup = registerAppLifecycleResources({
      removeEventHandlers: jest.fn(),
      closeOverlays: jest.fn(),
      messageHandler: jest.fn(),
      webComponentHost,
      loadInitialDocument: jest.fn(),
    });
    webComponentHost.loadInitialDocument = replacement;

    cleanup();

    expect(webComponentHost.loadInitialDocument).toBe(replacement);
  });
});

describe('subscribeToMediaQuery', () => {
  it('should stop delivering change events after unsubscribing', () => {
    const mediaQueryList = new EventTarget();
    const listener = jest.fn();
    const unsubscribe = subscribeToMediaQuery(mediaQueryList, listener);

    mediaQueryList.dispatchEvent(new Event('change'));
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    mediaQueryList.dispatchEvent(new Event('change'));
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
