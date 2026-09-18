import React, { useContext, useEffect, useMemo, useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react'; // Emotion's CacheProvider
import getRootNode from 'helpers/getRootNode';
import getCspNonce from 'helpers/getCspNonce';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';
import './ReactSelectWebComponentProvider.scss';

const ReactSelectWebComponentProvider = ({ children }) => {
  const [reconnectVersion, setReconnectVersion] = useState(0);
  const instanceRoot = useContext(InstanceRootNodeContext);

  useEffect(() => {
    if (!window.isApryseWebViewerWebComponent) {
      return () => {};
    }
    const handleReconnect = (event) => {
      const reconnectedHost = event?.detail?.host;
      if (instanceRoot?.host && reconnectedHost && reconnectedHost !== instanceRoot.host) {
        return;
      }
      setReconnectVersion((version) => version + 1);
    };
    window.addEventListener('apryse-webcomponent-reconnected', handleReconnect);
    return () => {
      window.removeEventListener('apryse-webcomponent-reconnected', handleReconnect);
    };
  }, [instanceRoot]);

  // Memoize the cache so it's created only once per container (shadow DOM root)
  const emotionCache = useMemo(() => {
    const container = instanceRoot || getRootNode();
    const cspNonce = getCspNonce();
    return createCache({
      key: 'wv-react-select-emotion', // Unique key for the cache
      container, // Set the container to the shadow DOM root for styles insertion
      ...(cspNonce && { nonce: cspNonce }),
    });
  }, [instanceRoot, reconnectVersion]);

  // Render with CacheProvider for emotion when inside a web component
  return window.isApryseWebViewerWebComponent ? (
    <CacheProvider value={emotionCache}>
      <div
        className="react-select-web-component-provider"
        onTouchEnd={(event) => {
          // At document level, shadow DOM taps target the host, so react-select
          // incorrectly treats them as outside taps and blurs its input.
          if (event.currentTarget.getRootNode().host) {
            event.stopPropagation();
          }
        }}
      >
        {children}
      </div>
    </CacheProvider>
  ) : (
    children
  );
};

export default ReactSelectWebComponentProvider;
