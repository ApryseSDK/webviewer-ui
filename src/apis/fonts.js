import actions from 'actions';
import selectors from 'selectors';

/**
 * A namespace which contains Font APIs for the UI. <br/><br/>
 * @namespace Fonts
 * @memberof UI
 * @example
 * WebViewer(...)
 * .then(function (instance) {
 *   instance.UI.Fonts.getFonts();
 * });
 */
export default (store) => Object.create(FontsAPI).initialize(store);

const FontsAPI = {
  initialize(store) {
    this.store = store;
    return this;
  },
  /**
   * Return the currently available fonts in the UI to be used for Annotations.
   * @method UI.Fonts.getAnnotationFonts
   * @returns {Array.<String>} Fonts avaialable in the UI.
   * @example
   WebViewer(...)
   .then(function(instance) {
    instance.UI.Fonts.getAnnotationFonts();
  });
   */
  getAnnotationFonts() {
    return [...selectors.getFonts(this.store.getState())];
  },
  /**
   * Add a font to be available in the UI for Annotation font pickers.
   * @method UI.Fonts.addAnnotationFont
   * @param {String} font - The font to be added.
   * @example
   WebViewer(...)
   .then(function(instance) {
    instance.UI.Fonts.addAnnotationFont("Arial");
  });
   */
  addAnnotationFont(font) {
    if (typeof font !== 'string') {
      throw new Error('Font must be a string');
    }
    const fonts = selectors.getFonts(this.store.getState());
    if (fonts.indexOf(font) !== -1) {
      return console.warn('Font already added');
    }
    fonts.push(font);
    this.store.dispatch(actions.setFonts(fonts));
  },
  /**
   * Remove a font from the UI's Annotation font pickers.
   * @method UI.Fonts.removeAnnotationFont
   * @param {String} font - The font to be removed.
   * @example
   WebViewer(...)
   .then(function(instance) {
    instance.UI.Fonts.removeAnnotationFont("Arial");
  });
   */
  removeAnnotationFont(font) {
    const fonts = selectors.getFonts(this.store.getState());
    const fontIndex = fonts.indexOf(font);
    if (fontIndex === -1) {
      return console.warn('Font not found');
    }
    fonts.splice(fontIndex, 1);
    this.store.dispatch(actions.setFonts(fonts));
  },
  /**
   * Set the fonts available in the UI's Annotation font pickers.
   * @method UI.Fonts.setAnnotationFonts
   * @param {Array.<String>} fonts - The fonts to be set.
   * @example
   WebViewer(...)
   .then(function(instance) {
    instance.UI.Fonts.setAnnotationFonts(["Arial", "Times New Roman"]);
  });
   */
  setAnnotationFonts(fonts) {
    this.store.dispatch(actions.setFonts(fonts));
  },
  /**
   * Returns the currently available fonts to be used when typing a signature in the signature dialog
   * @method UI.Fonts.getSignatureFonts
   * @returns {Array.<String>} Fonts avaialable in the UI.
   */
  getSignatureFonts() {
    return [...selectors.getSignatureFonts(this.store.getState())];
  },
  /**
   * Add a font to be available in the UI for Signature font pickers.
   * @method UI.Fonts.addSignatureFont
   * @param {String} font - The font to be added.
   * @example
   WebViewer(...)
   .then(function(instance) {
    instance.UI.Fonts.addSignatureFont("Arial");
  });
   */
  addSignatureFont(font) {
    if (typeof font !== 'string') {
      throw new Error('Font must be a string');
    }
    const fonts = selectors.getSignatureFonts(this.store.getState());
    if (fonts.indexOf(font) !== -1) {
      return console.warn('Font already added');
    }
    fonts.push(font);
    this.store.dispatch({
      type: 'SET_SIGNATURE_FONTS',
      payload: {
        signatureFonts: fonts,
      },
    });
  },
  /**
   * Remove a font from the UI's Signature font pickers.
   * @method UI.Fonts.removeSignatureFont
   * @param {String} font - The font to be removed.
   * @example
   WebViewer(...)
   .then(function(instance) {
    instance.UI.Fonts.removeSignatureFont("Arial");
  });
   */
  removeSignatureFont(font) {
    const fonts = selectors.getSignatureFonts(this.store.getState());
    const fontIndex = fonts.indexOf(font);
    if (fontIndex === -1) {
      return console.warn('Font not found');
    }
    fonts.splice(fontIndex, 1);
    this.store.dispatch({
      type: 'SET_SIGNATURE_FONTS',
      payload: {
        signatureFonts: fonts,
      },
    });
  },
  /**
   * Set the fonts available in the UI's Signature font pickers.
   * @method UI.Fonts.setSignatureFonts
   * @param {Array.<String>} fonts - The fonts to be set.
   * @example
   WebViewer(...)
   .then(function(instance) {
    instance.UI.Fonts.setSignatureFonts(["Arial", "Times New Roman"]);
  });
   */
  setSignatureFonts(fonts) {
    this.store.dispatch({
      type: 'SET_SIGNATURE_FONTS',
      payload: {
        signatureFonts: fonts,
      },
    });
  },
};