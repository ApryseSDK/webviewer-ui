import actions from 'actions';
import selectors from 'selectors';

import { parse } from 'helpers/cssVariablesParser';

import lightModeString from '!!raw-loader!../constants/light.scss';
import highContastLightModeString from '!!raw-loader!../constants/highContrastLight.scss';
import darkModeString from '!!raw-loader!../constants/dark.scss';
import highContrastDarkModeString from '!!raw-loader!../constants/highContrastDark.scss';
import cssVars from 'css-vars-ponyfill';
import Theme from '../constants/theme';

/**
 * Sets the theme of WebViewer UI. Please note that this does not work in IE11.
 * @method UI.setTheme
 * @param {string} theme Theme of WebViewerInstance UI.
 * @see UI.Theme
 * @example
WebViewer(...)
  .then(function(instance) {
    const theme = instance.UI.Theme;
    instance.UI.setTheme(theme.DARK);
  });
 */

export default store => {
  let previousActiveTheme = Theme.LIGHT; // default
  let previousIsHighContrastMode = false; // default

  cssVars({});
  store.subscribe(() => {
    const activeTheme = selectors.getActiveTheme(store.getState());
    const isHighContrastMode = selectors.getIsHighContrastMode(store.getState());

    if (previousActiveTheme !== activeTheme || previousIsHighContrastMode !== isHighContrastMode) {
      previousActiveTheme = activeTheme;
      previousIsHighContrastMode = isHighContrastMode;
      updateColors(activeTheme, isHighContrastMode);
    }
  });
  return theme => {
    const values = Object.values(Theme);
    if (values.indexOf(theme) < 0) {
      throw new Error(`${theme} is not one of: ${values.join(',')}}`);
    }
    store.dispatch(actions.setActiveTheme(theme));
  };
};

const setVariables = (themeVarString = '') => {
  const root = document.documentElement;
  const themeVariables = parse(themeVarString, {});
  Object.keys(themeVariables).forEach(key => {
    const themeVariable = themeVariables[key];
    root.style.setProperty(`--${key}`, themeVariable);
  });
};

const updateColors = (activeTheme, isHighContrastMode) => {
  if (activeTheme === Theme.LIGHT) {
    setVariables(isHighContrastMode ? highContastLightModeString : lightModeString);
  } else if (activeTheme === Theme.DARK) {
    setVariables(isHighContrastMode ? highContrastDarkModeString : darkModeString);
  }
  cssVars({
    // onlyLegacy: false,
    // preserveVars: true,
    // shadowDOM: true,
  });
};
