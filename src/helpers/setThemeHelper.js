
import Theme from '../constants/theme';
import getRootNode from 'helpers/getRootNode';

/**
 * Strings representing each of the possible theme combinations mapping to a unique stylesheet.
 * Used internally by setTheme.
 * @property {string} DARK The dark theme
 * @property {string} LIGHT The light theme
 * @property {string} DARK_MODULAR The dark theme when customizable UI is enabled
 * @property {string} LIGHT_MODULAR The light theme when customizable UI is enabled
 * @ignore
 */
export const InternalTheme = {
  DARK: 'dark',
  LIGHT: 'light',
  DARK_MODULAR: 'dark-modular',
  LIGHT_MODULAR: 'light-modular',
};

/**
 * Maps each flag combination to its corresponding internal theme string
 * @param {UI.Theme} activeTheme The active theme (light or dark)
 * @param {boolean} isCustomizableUI Whether customizable UI is enabled
 * @returns {InternalTheme} The internal theme string corresponding to the given theme flags
 * @ignore
 */
export const getInternalTheme = (activeTheme, isCustomizableUI) => {
  if (activeTheme !== Theme.LIGHT && activeTheme !== Theme.DARK) {
    throw new Error(`Invalid theme: ${activeTheme}`);
  }
  const isThemeLight = activeTheme === Theme.LIGHT;
  if (isCustomizableUI) {
    return isThemeLight ? InternalTheme.LIGHT_MODULAR : InternalTheme.DARK_MODULAR;
  } else {
    return isThemeLight ? InternalTheme.LIGHT : InternalTheme.DARK;
  }
};

/**
 * Searches the DOM for <style> or <link> elements corresponding to the given internal theme and adds them to the loadedThemes object
 * @param {InternalTheme} internalTheme The internal theme string
 * @param {object} loadedThemes An object mapping internal theme strings to arrays of the corresponding DOM <style> or <link> elements that have been loaded
 * @param {ShadowRoot|Document} [rootNodeOverride] The root to search within. In multi-instance WebComponent mode this should be the CALLING instance's own root (its ShadowRoot), not the module-level getRootNode() singleton, which points to whichever instance was most recently registered and would cause a setTheme() call on one instance to toggle another instance's theme styles. Falls back to getRootNode() for backward compatibility (single-instance / iframe mode).
 * @ignore
 */
export const searchForThemeElements = (internalTheme, loadedThemes, rootNodeOverride) => {
  let root = rootNodeOverride || getRootNode();
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
 * Returns a promise that resolves once the <link> for the given internal theme
 * has been fully loaded by the browser (i.e. its stylesheet is parsed and
 * available). This is needed because webpack's dynamic import() resolves when
 * the *JS* chunk runs and inserts the <link> element, not when the browser
 * has actually fetched and applied the CSS file.
 *
 * Falls back to a 5 s timeout so a slow/failed network load never blocks
 * rendering indefinitely.
 * @param {InternalTheme} internalTheme
 * @param {ShadowRoot|Document} [rootNodeOverride] The calling instance's own root to search within (see searchForThemeElements for why this must not default to the getRootNode() singleton in multi-instance WebComponent mode).
 * @ignore
 */
export const waitForThemeLinkLoad = (internalTheme, rootNodeOverride) => {
  if (typeof internalTheme !== 'string') {
    return Promise.resolve();
  }
  let root = rootNodeOverride || getRootNode();
  if (!root || root === document) {
    root = document.head;
  }
  const link = root.querySelector(`link[href*="theme-${internalTheme}.chunk.css"]`);
  if (!link) {
    return Promise.resolve();
  }
  // sheet is non-null once the browser has parsed the CSS.
  if (link.sheet) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const fallback = setTimeout(resolve, 5000);
    const finish = () => {
      clearTimeout(fallback);
      resolve();
    };
    link.addEventListener('load', finish, { once: true });
    link.addEventListener('error', finish, { once: true });
  });
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
  } else {
    throw new Error(`Invalid theme: ${internalTheme}`);
  }
};