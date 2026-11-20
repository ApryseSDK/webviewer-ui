import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';

// Fires from a timer, by which time a sibling instance may be ambient, so the owning instance is explicit.
export function scheduleViewerLoadedEvent(instanceId) {
  return setTimeout(() => {
    fireEvent(Events.VIEWER_LOADED, undefined, null, instanceId);
  }, 300);
}

export function registerAppLifecycleResources({
  removeEventHandlers,
  closeOverlays,
  messageHandler,
  viewerLoadedTimeout,
  documentLoadTimeout,
  webComponentHost,
  loadInitialDocument,
}) {
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden' && document.activeElement) {
      document.activeElement.blur();
    }
  };

  window.addEventListener('blur', closeOverlays);
  window.addEventListener('message', messageHandler, false);
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Web Component hosts call this after registering their ready listeners so initial loading is deterministic.
  if (webComponentHost && typeof webComponentHost === 'object') {
    webComponentHost.loadInitialDocument = loadInitialDocument;
  }

  return () => {
    removeEventHandlers();
    clearTimeout(viewerLoadedTimeout);
    clearTimeout(documentLoadTimeout);
    window.removeEventListener('blur', closeOverlays);
    window.removeEventListener('message', messageHandler, false);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (webComponentHost?.loadInitialDocument === loadInitialDocument) {
      delete webComponentHost.loadInitialDocument;
    }
  };
}

export function subscribeToMediaQuery(mediaQueryList, listener) {
  mediaQueryList.addEventListener('change', listener);
  return () => mediaQueryList.removeEventListener('change', listener);
}
