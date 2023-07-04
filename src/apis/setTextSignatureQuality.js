/**
 * Sets the multiplier used when creating typed, text signatures. This improves the quality of the rendered signature at the cost of more memory.
 * @method UI.setTextSignatureQuality
 * @param {number} multiplier The multiplier value used to scale the image output
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setTextSignatureQuality(2);
 */

import actions from 'actions';

export default (store) => (multiplier) => {
  store.dispatch(actions.setTextSignatureQuality(multiplier));
};
