import { createInstanceScopedState } from 'core/documentViewers';

const fontPathState = createInstanceScopedState(() => ({ fontPath: null }));
/**
 * Set the path of fonts used in UI
 * @name setFontPath
 * @memberof Core
 * @function
 * @param {string} path the prefix url for font path.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setFontPath('path/to/font');
  });
 */
export const setFontPath = (path) => {
  if (!path.endsWith('/')) {
    path += '/';
  }
  fontPathState.get().fontPath = path;
};

/**
 * Get the path of the font used in UI.
 * @name getFontPath
 * @memberof Core
 * @function
 * @returns {string} the prefix url for font path.
 */
export const getFontPath = () => {
  return fontPathState.get().fontPath;
};