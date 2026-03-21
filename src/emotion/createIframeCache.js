import createCache from '@emotion/cache';

// Use a dedicated Emotion cache that targets the iframe's document head so styles are scoped to the iframe.
const createIframeCache = () => createCache({
  key: 'apryse-iframe',
  container: document.head,
});

export default createIframeCache;
