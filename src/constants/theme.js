/**
 * Contains string enumeration for all themes for WebViewer. They are used to set the viewer theme.
 * @typedef UI.Theme
 * @property {string} DARK The theme where the WebViewer will be dark.
 * @property {string} LIGHT The theme where the WebViewer will be light.
 * @example
WebViewer(...)
  .then(function(instance) {
    const theme = instance.UI.Theme;
    instance.UI.setTheme(theme.DARK);
  });
 */

export default {
  DARK: 'dark',
  LIGHT: 'light',
};