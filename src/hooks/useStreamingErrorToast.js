import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { useInstanceCore } from 'hooks/useCore/useCore';
import { subscribeToStreamingErrors } from 'components/App/streamingErrorHandler';

/**
 * Subscribes to streaming chunk failures on all active document viewers and
 * returns the visibility state of the streaming error toast.
 *
 * Re-subscribes automatically when the set of viewers changes (multi-viewer
 * mode toggle or active viewer key change) so that errors in newly-added
 * viewers are always captured.
 *
 * @returns {{ isVisible: boolean, dismiss: Function }}
 */
export default function useStreamingErrorToast() {
  const core = useInstanceCore();
  const [isVisible, setIsVisible] = useState(false);
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  useEffect(() => subscribeToStreamingErrors(
    () => core.getDocumentViewers(),
    () => setIsVisible(true),
    () => setIsVisible(false),
  ), [core, isMultiViewerMode, activeDocumentViewerKey]);

  // The threaded WASM backend fails inside its own workers when the network drops, so no downloadError
  // is raised. Going offline while a streamed document is still downloading is an interruption too.
  useEffect(() => {
    const onOffline = () => {
      const isStreaming = core.getDocumentViewers().some((viewer) => {
        const document = viewer.getDocument?.();
        return document?.isLinearized?.() && !document.isDocumentComplete?.();
      });
      if (isStreaming) {
        setIsVisible(true);
      }
    };
    window.addEventListener('offline', onOffline);
    return () => window.removeEventListener('offline', onOffline);
  }, [core]);

  return {
    isVisible,
    dismiss: () => setIsVisible(false),
  };
}
