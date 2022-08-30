/**
 * Sets preset crop dimensions to be used when selecting a preset crop in the document cropping popup
 * @method UI.setPresetCropDimensions
 * @param {string} presetName The name of a current preset or the name to give to a new preset
 * @param {object} newPreset A set of dimensions to use for a preset crop
 * @param {number} newPreset.yOffset The amount of inches to move the cropped area from the top of the page
 * @param {number} newPreset.height The height of the area to crop the page to in inches
 * @param {number} newPreset.xOffset The amount of inches to move the cropped area from the left of the page
 * @param {number} newPreset.width The width of the area to crop the page to in inches
 *
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setPresetCropDimensions('Letter', {'yOffset': 0, 'height': 11, 'xOffset': 0, 'width': 8.5});
  });
 */

import actions from 'actions';
import selectors from 'selectors';

const dimensions = ['yOffset', 'height', 'xOffset', 'width'];

export default (store) => (presetName, newPreset) => {
  if (!presetName || typeof presetName !== 'string' || presetName.trim().length < 1) {
    return console.error('presetName must be a string of length 1 or more');
  }
  if (!newPreset || typeof newPreset !== 'object') {
    return console.error('newPreset must be an object with "yOffset", "height", "xOffset", and "width" properties');
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

  store.dispatch(actions.setPresetCropDimensions(presets));
};
