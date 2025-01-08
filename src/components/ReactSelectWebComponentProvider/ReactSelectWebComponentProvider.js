import React, { useMemo } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react'; // Emotion's CacheProvider
import getRootNode from 'helpers/getRootNode';

const ReactSelectWebComponentProvider = ({ children }) => {
  // Memoize the cache so it's created only once per container (shadow DOM root)
  const emotionCache = useMemo(() => {
    const container = getRootNode(); // Ensure we get the root node of the shadow DOM
    return createCache({
      key: 'wv-react-select-emotion', // Unique key for the cache
      container, // Set the container to the shadow DOM root for styles insertion
    });
  }, []);

  // Render with CacheProvider for emotion when inside a web component
  return window.isApryseWebViewerWebComponent ? (
    <CacheProvider value={emotionCache}>
      {children}
    </CacheProvider>
  ) : (
    children
  );
};

export default ReactSelectWebComponentProvider;