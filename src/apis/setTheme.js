import actions from 'actions';
import selectors from 'selectors';

import { parse } from 'helpers/cssVariablesParser';

import modularUILightModeString from '!!raw-loader!../constants/lightWCAG.scss';
import lightModeString from '!!raw-loader!../constants/light.scss';
import highContastLightModeString from '!!raw-loader!../constants/highContrastLight.scss';
import darkModeString from '!!raw-loader!../constants/dark.scss';
import highContrastDarkModeString from '!!raw-loader!../constants/highContrastDark.scss';
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

export default (store) => {
  let previousActiveTheme = Theme.LIGHT; // default
  let previousIsHighContrastMode = false; // default

  store.subscribe(() => {
    const state = store.getState();
    const activeTheme = selectors.getActiveTheme(state);
    const isHighContrastMode = selectors.getIsHighContrastMode(state);
    const isCustomizableUI = state.featureFlags.customizableUI;

    if (previousActiveTheme !== activeTheme || previousIsHighContrastMode !== isHighContrastMode || window.isApryseWebViewerWebComponent || isCustomizableUI) {
      previousActiveTheme = activeTheme;
      previousIsHighContrastMode = isHighContrastMode;
      updateColors(activeTheme, isHighContrastMode, isCustomizableUI);
    }
  });
  return (theme) => {
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
  Object.keys(themeVariables).forEach((key) => {
    const themeVariable = themeVariables[key];
    root.style.setProperty(`--${key}`, themeVariable);
  });
};

const updateColors = (activeTheme, isHighContrastMode, isCustomizableUI) => {
  if (isCustomizableUI) {
    setVariables(modularUILightModeString);
  } else if (activeTheme === Theme.LIGHT) {
    setVariables(isHighContrastMode ? highContastLightModeString : lightModeString);
  } else if (activeTheme === Theme.DARK) {
    setVariables(isHighContrastMode ? highContrastDarkModeString : darkModeString);
  }
};
