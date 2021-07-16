/**
 * Set the fonts that are used when typing a signature in the signature dialog.
 * @method UI.setSignatureFonts
 * @param {Array.<string>|UI.setSignatureFontsCallback} fonts An array of font families.
 * @example // 6.1
WebViewer(...)
  .then(function(instance) {
    instance.UI.setSignatureFonts(['GreatVibes-Regular']);
    instance.UI.setSignatureFonts(currentFonts => [
      ...currentFonts,
      'sans-serif',
    ]);
  });
 */

/**
 * @callback UI.setSignatureFontsCallback
 * @param {Array.<string>} fonts current font families
 * @returns {Array.<string>} fonts to set.
 */

import selectors from 'selectors';

export default store => arg => {
  let fonts;

  if (typeof arg === 'string') {
    fonts = [arg];
  }

  if (Array.isArray(arg)) {
    fonts = arg;
  }

  if (typeof arg === 'function') {
    const currentFonts = selectors.getSignatureFonts(store.getState());
    fonts = arg(currentFonts);
  }

  if (fonts) {
    store.dispatch({
      type: 'SET_SIGNATURE_FONTS',
      payload: {
        signatureFonts: fonts,
      },
    });
  }
};
