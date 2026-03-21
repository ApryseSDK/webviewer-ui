
import Theme from '../constants/theme';
import getRootNode from 'helpers/getRootNode';

/**
 * Strings representing each of the possible theme combinations mapping to a unique stylesheet.
 * Used internally by setTheme.
 * @property {string} DARK The dark theme
 * @property {string} LIGHT The light theme
 * @property {string} DARK_MODULAR The dark theme when customizable UI is enabled
 * @property {string} LIGHT_MODULAR The light theme when customizable UI is enabled
 * @property {string} DARK_HIGH_CONTRAST The dark theme when high contrast is enabled
 * @property {string} LIGHT_HIGH_CONTRAST The light theme when high contrast is enabled
 * @ignore
 */
export const InternalTheme = {
  DARK: 'dark',
  LIGHT: 'light',
  DARK_MODULAR: 'dark-modular',
  LIGHT_MODULAR: 'light-modular',
  DARK_HIGH_CONTRAST: 'dark-high-contrast',
  LIGHT_HIGH_CONTRAST: 'light-high-contrast',
};

/**
 * Maps each flag combination to its corresponding internal theme string
 * @param {UI.Theme} activeTheme The active theme (light or dark)
 * @param {boolean} isHighContrastMode Whether high contrast mode is enabled
 * @param {boolean} isCustomizableUI Whether customizable UI is enabled
 * @returns {InternalTheme} The internal theme string corresponding to the given theme flags
 * @ignore
 */
export const getInternalTheme = (activeTheme, isHighContrastMode, isCustomizableUI) => {
  if (activeTheme !== Theme.LIGHT && activeTheme !== Theme.DARK) {
    throw new Error(`Invalid theme: ${activeTheme}`);
  }
  const isThemeLight = activeTheme === Theme.LIGHT;
  if (isCustomizableUI) {
    return isThemeLight ? InternalTheme.LIGHT_MODULAR : InternalTheme.DARK_MODULAR;
  } else if (isHighContrastMode) {
    return isThemeLight ? InternalTheme.LIGHT_HIGH_CONTRAST : InternalTheme.DARK_HIGH_CONTRAST;
  } else {
    return isThemeLight ? InternalTheme.LIGHT : InternalTheme.DARK;
  }
};

/**
 * Searches the DOM for <style> or <link> elements corresponding to the given internal theme and adds them to the loadedThemes object
 * @param {InternalTheme} internalTheme The internal theme string
 * @param {object} loadedThemes An object mapping internal theme strings to arrays of the corresponding DOM <style> or <link> elements that have been loaded
 * @ignore
 */
export const searchForThemeElements = (internalTheme, loadedThemes) => {
  let root = getRootNode();
  if (root === document) {
    root = document.head;
  }
  const elements = root.querySelectorAll(`style[data-theme="${internalTheme}"], link[href*="theme-${internalTheme}.chunk.css"]`);
  loadedThemes[internalTheme] = [];
  elements.forEach((el) => {
    loadedThemes[internalTheme].push(el);
  });
  return loadedThemes[internalTheme];
};

/**
 * Enables the elements corresponding to the given internal theme
 * @param {InternalTheme} internalTheme
 * @param {object} loadedThemes An object mapping internal theme strings to arrays of the corresponding DOM <style> or <link> elements that have been loaded
 * @ignore
 */
export const enableThemeElements = (internalTheme, loadedThemes) => {
  if (!internalTheme || !loadedThemes[internalTheme]) {
    return;
  }
  // Enable new theme styles (they're already in the DOM, just disabled)
  for (const el of loadedThemes[internalTheme]) {
    if (el.tagName === 'LINK') {
      el.disabled = false;
    } else {
      el.media = 'all';
    }
  }
};

/**
 * Disables the elements corresponding to the given internal theme
 * @param {InternalTheme} internalTheme
 * @param {object} loadedThemes An object mapping internal theme strings to arrays of the corresponding DOM <style> or <link> elements that have been loaded
 * @ignore
 */
export const disableThemeElements = (internalTheme, loadedThemes) => {
  if (!internalTheme || !loadedThemes[internalTheme]) {
    return;
  }
  for (const el of loadedThemes[internalTheme]) {
    if (el.tagName === 'LINK') {
      el.disabled = true;
    } else {
      el.media = 'not all';
    }
  }
};

/**
 * Imports a stylesheet corresponding to the given internal theme.
 * Throws an error if no such theme exists.
 * @param {InternalTheme} internalTheme The string representing which theme to import
 * @ignore
 */
export const importTheme = async (internalTheme) => {
  if (internalTheme === InternalTheme.LIGHT) {
    await import(/* webpackChunkName: "theme-light" */ '../components/App/App.scss?theme-light');
  } else if (internalTheme === InternalTheme.DARK) {
    await import(/* webpackChunkName: "theme-dark" */ '../components/App/App.scss?theme-dark');
  } else if (internalTheme === InternalTheme.LIGHT_MODULAR) {
    await import(/* webpackChunkName: "theme-light-modular" */ '../components/App/App.scss?theme-light-modular');
  } else if (internalTheme === InternalTheme.DARK_MODULAR) {
    await import(/* webpackChunkName: "theme-dark-modular" */ '../components/App/App.scss?theme-dark-modular');
  } else if (internalTheme === InternalTheme.LIGHT_HIGH_CONTRAST) {
    await import(/* webpackChunkName: "theme-light-high-contrast" */ '../components/App/App.scss?theme-light-high-contrast');
  } else if (internalTheme === InternalTheme.DARK_HIGH_CONTRAST) {
    await import(/* webpackChunkName: "theme-dark-high-contrast" */ '../components/App/App.scss?theme-dark-high-contrast');
  } else {
    throw new Error(`Invalid theme: ${internalTheme}`);
  }
};