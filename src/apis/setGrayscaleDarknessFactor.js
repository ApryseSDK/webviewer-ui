import { setGrayscaleDarknessFactor } from 'helpers/print';

/**
 * Set Grayscale Darkness Factor for printing in Grayscale
 * @method UI.setGrayscaleDarknessFactor
 * @param {number} darknessFactor Default is '1', '0' is fully black and white
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.setGrayscaleDarknessFactor(0.5);
  });
 */

export default (darknessFactor) => {
  setGrayscaleDarknessFactor(darknessFactor);
};
