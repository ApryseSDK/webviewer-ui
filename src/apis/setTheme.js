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
 * @param {(string|object)} theme Either theme object or predefined string. Predefined strings are 'default' and 'dark'.
 * @param {string} [theme.primary=#FFFFFF] Background color for the header, modals, overlays, etc.
 * @param {string} [theme.secondary=#F5F5F5] ackground color for panels and the document container.
 * @param {string} [theme.border=#CDCDCD] Border color for different components.
 * @param {string} [theme.buttonHover=#F6F6F6] Background color for hovering on a button.
 * @param {string} [theme.buttonActive=#F0F0F0] Background color for an active button.
 * @param {string} [theme.text=#333333] Text color.
 * @param {string} [theme.icon=#757575] Icon color.
 * @param {string} [theme.iconActive=#757575] Icon color when button is active.
 * @example
// Using an object
WebViewer(...)
  .then(function(instance) {
    instance.setTheme({
      primary: '#2C2B3A',
      secondary: '#4D4C5F',
      border: '#555555',
      buttonHover: '#686880',
      buttonActive: '#686880',
      text: '#FFFFFF',
      icon: '#FFFFFF',
      iconActive: '#FFFFFF'
    });
  });
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
