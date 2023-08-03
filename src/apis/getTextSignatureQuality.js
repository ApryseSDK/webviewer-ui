/**
 * Gets the multiplier used when creating typed, text signatures.
 * @method UI.getTextSignatureQuality
 * @return {number} The multiplier value
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.getTextSignatureQuality(4);
  });
 */

import selectors from 'selectors';

export default (store) => () => selectors.getTextSignatureQuality(store.getState());