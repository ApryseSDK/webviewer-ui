/**
 * String enumeration of available themes for WebViewer. Use these values to set the viewer's theme.
 * @name UI.Theme
 * @property {string} DARK The dark theme for WebViewer.
 * @property {string} LIGHT The light theme for WebViewer.
 * @example
 * WebViewer(...)
 *   .then(function(instance) {
 *     const theme = instance.UI.Theme;
 *     instance.UI.setTheme(theme.DARK);
 *   });
 */

export default {
  DARK: 'dark',
  LIGHT: 'light',
};