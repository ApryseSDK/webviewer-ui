import actions from 'actions';
import selectors from 'selectors';

import { parse } from 'helpers/cssVariablesParser';

import lightModeString from '!!raw-loader!../constants/light.scss';
import highContastLightModeString from '!!raw-loader!../constants/highContrastLight.scss';
import darkModeString from '!!raw-loader!../constants/dark.scss';
import highContrastDarkModeString from '!!raw-loader!../constants/highContrastDark.scss';
import cssVars from 'css-vars-ponyfill';

/**
 * Sets the theme of WebViewer UI. Please note that this does not work in IE11.
 * @method WebViewerInstance#setTheme
 * @param {string} theme Either the string 'light' or 'dark'.
 * @example
// Using predefined string
WebViewer(...)
  .then(function(instance) {
    instance.setTheme('dark');
  });
 */

export default store => {
  let previousActiveTheme = 'light'; // default
  let previousIsHighContrastMode = false; // default

  cssVars({});
  store.subscribe(() => {
    const activeTheme = selectors.getActiveTheme(store.getState());
    const isHighContrastMode = selectors.getIsHighContrastMode(store.getState());

    if (previousActiveTheme !== activeTheme || previousIsHighContrastMode !== isHighContrastMode) {
      previousActiveTheme = activeTheme;
      previousIsHighContrastMode = isHighContrastMode;
      updateColours(activeTheme, isHighContrastMode);
    }
  });
  return theme => {
    if (theme !== 'dark' && theme !== 'light') {
      throw new Error(`${theme} is not one of: light, dark`);
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

const updateColours = (activeTheme, isHighContrastMode)  => {
  if (activeTheme === 'light') {
    setVariables(isHighContrastMode ? highContastLightModeString : lightModeString);
  } else if (activeTheme === 'dark') {
    setVariables(isHighContrastMode ? highContrastDarkModeString : darkModeString);
  }
  cssVars({
    // onlyLegacy: false,
    // preserveVars: true,
    // shadowDOM: true,
  });
};
