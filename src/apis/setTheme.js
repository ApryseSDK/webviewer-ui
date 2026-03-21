import actions from 'actions';
import selectors from 'selectors';
import Theme from '../constants/theme';
import { getInternalTheme, searchForThemeElements, enableThemeElements, disableThemeElements, importTheme } from 'helpers/setThemeHelper';

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
  let previousInternalTheme = null; // default; no theme is loaded initially
  let previousActiveTheme = Theme.LIGHT; // default
  let previousIsHighContrastMode = false; // default
  let previousIsCustomizableUI = false; // default

  /**
   * Maps internal theme strings to arrays of the corresponding DOM <style> or <link> elements
   * {[key: string]: Array<HTMLStyleElement | HTMLLinkElement>}
   * @ignore
   */
  const loadedThemes = {};
  let currentlyLoadingTheme = null;

  /**
   * Promise queue to ensure only one theme update runs at a time
   * @ignore
   */
  let updateThemeQueue = Promise.resolve();

  /**
   * Updates the active theme by doing the following:
   *    - If theme did not change or is in the process of being loaded, do nothing.
   *    - Else if theme has never been loaded before, import it and then disable the previous theme's styles.
   *    - Else if theme was already loaded, enable its styles and disable the previous theme's styles.
   * @param {UI.Theme} newTheme
   * @param {boolean} newIsHighContrastMode
   * @param {boolean} newIsCustomizableUI
   * @ignore
   */
  const updateTheme = async (
    newTheme = previousActiveTheme,
    newIsHighContrastMode = previousIsHighContrastMode,
    newIsCustomizableUI = previousIsCustomizableUI
  ) => {
    const internalTheme = getInternalTheme(newTheme, newIsHighContrastMode, newIsCustomizableUI);
    const isLoading = currentlyLoadingTheme === internalTheme;
    const isActive = previousInternalTheme === internalTheme;
    if (isLoading || isActive) {
      return;
    }

    currentlyLoadingTheme = internalTheme;
    try {
      if (previousInternalTheme && !loadedThemes[previousInternalTheme]) {
        searchForThemeElements(previousInternalTheme, loadedThemes);
      }
      const isAlreadyLoaded = loadedThemes[internalTheme];
      if (isAlreadyLoaded) {
        enableThemeElements(internalTheme, loadedThemes);
      } else {
        await importTheme(internalTheme);
      }

      disableThemeElements(previousInternalTheme, loadedThemes);
      previousInternalTheme = internalTheme;
      previousActiveTheme = newTheme;
      previousIsHighContrastMode = newIsHighContrastMode;
      previousIsCustomizableUI = newIsCustomizableUI;
    } finally {
      currentlyLoadingTheme = null;
    }
  };

  store.subscribe(() => {
    const state = store.getState();
    const activeTheme = selectors.getActiveTheme(state);
    const isHighContrastMode = selectors.getIsHighContrastMode(state);
    const isCustomizableUI = state.featureFlags.customizableUI;

    updateThemeQueue = updateThemeQueue.then(() => {
      const shouldUpdateTheme = previousActiveTheme !== activeTheme
        || previousIsHighContrastMode !== isHighContrastMode
        || window.isApryseWebViewerWebComponent
        || previousIsCustomizableUI !== isCustomizableUI;

      if (shouldUpdateTheme) {
        // Chain the update onto the queue to serialize theme updates
        return updateTheme(activeTheme, isHighContrastMode, isCustomizableUI);
      }
    }).catch((error) => {
      console.error('Theme update failed:', error);
    });
  });
  return (theme) => {
    const values = Object.values(Theme);
    if (values.indexOf(theme) < 0) {
      throw new Error(`${theme} is not one of: ${values.join(',')}}`);
    }
    store.dispatch(actions.setActiveTheme(theme));
  };
};
