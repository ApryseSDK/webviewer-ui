/**
 * Set the fonts that are used when typing a signature in the signature dialog
 * @method WebViewer#setSignatureFonts
 * @param {Array.<string>|function} fonts An array of font families.
 * If a callback is used, an array of current font families will be passed to it as the first argument. The callback should return an array of font families that should be set.
 * @example // 6.1
WebViewer(...)
  .then(function(instance) {
    instance.setSignatureFonts(['GreatVibes-Regular']);
    instance.setSignatureFonts(currentFonts => [
      ...currentFonts,
      'sans-serif',
    ]);
  });
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
