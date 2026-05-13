import createCache from '@emotion/cache';

// Use a dedicated Emotion cache that targets the shadowRoot so styles cross the Shadow DOM boundary.
const createShadowRootCache = (shadowRoot, nonce) => createCache({
  key: 'apryse-wc',
  container: shadowRoot,
  ...(nonce && { nonce }),
});

export default createShadowRootCache;
