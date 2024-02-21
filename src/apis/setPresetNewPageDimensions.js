/**
 * Sets preset page dimensions to be used when selecting a page size in the Insert Page Modal
 * @method UI.setPresetNewPageDimensions
 * @param {string} presetName The name of a current preset or the name to give to a new preset
 * @param {object} newPreset A set of dimensions to use for a preset new page
 * @param {number} newPreset.height The height of the new page in inches
 * @param {number} newPreset.width The width of the new page in inches
 *
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setPresetNewPageDimensions('Letter', {'height': 11, 'width': 8.5});
  });
 */

import actions from 'actions';
import selectors from 'selectors';

const dimensions = ['height', 'width'];

export default (store) => (presetName, newPreset) => {
  if (!presetName || typeof presetName !== 'string' || presetName.trim().length < 1) {
    return console.error('presetName must be a string of length 1 or more');
  }
  if (!newPreset || typeof newPreset !== 'object') {
    return console.error('newPreset must be an object with "height", and "width" properties');
  }

  for (const dimension of dimensions) {
    if (!(dimension in newPreset)) {
      return console.error(`${dimension} must be included in newPreset`);
    }
    if (typeof newPreset[dimension] !== 'number' || newPreset[dimension] < 0) {
      return console.error(`${dimension} must be a number greater than or equal to 0`);
    }
  }

  const presets = selectors.getPresetCropDimensions(store.getState());
  presets[presetName] = newPreset;

  store.dispatch(actions.setPresetNewPageDimensions(presets));
};
