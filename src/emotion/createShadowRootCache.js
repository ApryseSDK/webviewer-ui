import createCache from '@emotion/cache';

// Use a dedicated Emotion cache that targets the shadowRoot so styles cross the Shadow DOM boundary.
const createShadowRootCache = (shadowRoot) => createCache({
  key: 'apryse-wc',
  container: shadowRoot,
});

export default createShadowRootCache;
