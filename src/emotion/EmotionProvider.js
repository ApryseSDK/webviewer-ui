import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import createShadowRootCache from './createShadowRootCache';
import createIframeCache from './createIframeCache';
import getCspNonce from 'helpers/getCspNonce';

const EmotionProvider = ({ rootNode, children }) => {
  const [reconnectVersion, setReconnectVersion] = useState(0);

  useEffect(() => {
    if (!window.isApryseWebViewerWebComponent) {
      return () => {};
    }

    const handleReconnect = (event) => {
      const reconnectedHost = event?.detail?.host;
      if (!reconnectedHost || reconnectedHost !== rootNode?.host) {
        return;
      }
      // Drop stale cache so we rebuild against the current shadow-root lifecycle.
      delete reconnectedHost.__emotionCache;
      setReconnectVersion((version) => version + 1);
    };

    window.addEventListener('apryse-webcomponent-reconnected', handleReconnect);
    return () => {
      window.removeEventListener('apryse-webcomponent-reconnected', handleReconnect);
    };
  }, [rootNode]);

  const cacheValue = useMemo(() => {
    const nonce = getCspNonce();

    if (window.isApryseWebViewerWebComponent && rootNode?.host) {
      const hostElement = rootNode.host;
      if (!hostElement.__emotionCache || hostElement.__emotionCache.sheet?.container !== rootNode) {
        hostElement.__emotionCache = createShadowRootCache(rootNode, nonce);
      }
      return hostElement.__emotionCache;
    }

    if (window.parent !== window && !window.isApryseWebViewerWebComponent) {
      if (!window.__emotionCache) {
        window.__emotionCache = createIframeCache(nonce);
      }
      return window.__emotionCache;
    }

    return null;
  }, [rootNode, reconnectVersion]);

  if (!cacheValue) {
    return children;
  }

  return (
    <CacheProvider value={cacheValue}>
      {children}
    </CacheProvider>
  );
};

EmotionProvider.propTypes = {
  rootNode: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default EmotionProvider;
