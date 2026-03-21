import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import createShadowRootCache from './createShadowRootCache';
import createIframeCache from './createIframeCache';

const EmotionProvider = ({ rootNode, children }) => {
  const cacheValue = useMemo(() => {
    if (window.isApryseWebViewerWebComponent && rootNode?.host) {
      const hostElement = rootNode.host;
      if (!hostElement.__emotionCache) {
        hostElement.__emotionCache = createShadowRootCache(rootNode);
      }
      return hostElement.__emotionCache;
    }

    if (window.parent !== window && !window.isApryseWebViewerWebComponent) {
      if (!window.__emotionCache) {
        window.__emotionCache = createIframeCache();
      }
      return window.__emotionCache;
    }

    return null;
  }, [rootNode]);

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
