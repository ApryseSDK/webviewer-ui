import React, { useEffect, useMemo, useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react'; // Emotion's CacheProvider
import getRootNode from 'helpers/getRootNode';
import getCspNonce from 'helpers/getCspNonce';

const ReactSelectWebComponentProvider = ({ children }) => {
  const [reconnectVersion, setReconnectVersion] = useState(0);

  useEffect(() => {
    if (!window.isApryseWebViewerWebComponent) {
      return () => {};
    }
    const handleReconnect = () => {
      setReconnectVersion((version) => version + 1);
    };
    window.addEventListener('apryse-webcomponent-reconnected', handleReconnect);
    return () => {
      window.removeEventListener('apryse-webcomponent-reconnected', handleReconnect);
    };
  }, []);

  // Memoize the cache so it's created only once per container (shadow DOM root)
  const emotionCache = useMemo(() => {
    const container = getRootNode(); // Ensure we get the root node of the shadow DOM
    const cspNonce = getCspNonce();
    return createCache({
      key: 'wv-react-select-emotion', // Unique key for the cache
      container, // Set the container to the shadow DOM root for styles insertion
      ...(cspNonce && { nonce: cspNonce }),
    });
  }, [reconnectVersion]);

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
