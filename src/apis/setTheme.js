import actions from 'actions';
import selectors from 'selectors';

import { parse } from 'css-variables-parser';

import lightModeString from '!!raw-loader!../constants/light.scss';
import lightToolsMobileString from '!!raw-loader!../constants/lightToolsMobile.scss';
import darkModeString from '!!raw-loader!../constants/dark.scss';
import darkToolsMobileString from '!!raw-loader!../constants/darkToolsMobile.scss';


/**
 * Sets the theme of Webviewer UI. Please note that this does not work in IE11.
 * @method WebViewerInstance#setTheme
 * @param {string} theme Either the string 'light' or 'dark'.
 * @example
// Using predefined string
WebViewer(...)
  .then(function(instance) {
    instance.setTheme('dark');
  });
 */

const mobileListener = window.matchMedia('(max-width: 640px)');
const tabletListener = window.matchMedia('(min-width: 641px) and (max-width: 900px)');
const desktopListener = window.matchMedia('(min-width: 901px)');

export default store => {
  mobileListener.addListener(() => {
    updateColours(store);
  });

  tabletListener.addListener(() => {
    updateColours(store);
  });

  desktopListener.addListener(() => {
    updateColours(store);
  });

  let previousActiveTheme;
  store.subscribe(() => {
    const activeTheme = selectors.getActiveTheme(store.getState());
    if (previousActiveTheme !== activeTheme) {
      previousActiveTheme = activeTheme;
      updateColours(store);
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

const updateColours = store => {
  const activeTheme = selectors.getActiveTheme(store.getState());
  if (window.matchMedia('(max-width: 640px)').matches) {
    if (activeTheme === 'light') {
      setVariables(lightModeString);
      setVariables(lightToolsMobileString);
    } else if (activeTheme === 'dark') {
      setVariables(darkModeString);
      setVariables(darkToolsMobileString);
    }
  } else if (window.matchMedia('(max-width: 900px)').matches) {
    if (activeTheme === 'light') {
      setVariables(lightModeString);
      setVariables(lightToolsMobileString);
    } else if (activeTheme === 'dark') {
      setVariables(darkModeString);
      setVariables(darkToolsMobileString);
    }
  } else {
    if (activeTheme === 'light') {
      setVariables(lightModeString);
    } else if (activeTheme === 'dark') {
      setVariables(darkModeString);
    }
  }
};
