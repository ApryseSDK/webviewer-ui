import actions from 'actions';
import selectors from 'selectors';
import Theme from '../constants/theme';
import {
  getInternalTheme,
  searchForThemeElements,
  enableThemeElements,
  disableThemeElements,
  importTheme,
  waitForThemeLinkLoad,
} from 'helpers/setThemeHelper';

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
export default (store, instanceRootNode) => {
  let previousInternalTheme = null; // default; no theme is loaded initially
  const initialState = store.getState();
  let previousActiveTheme = selectors.getActiveTheme(initialState) || Theme.LIGHT;
  let previousIsCustomizableUI = initialState.featureFlags.customizableUI;

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

  // Prime theme styles immediately so startup can paint in the configured theme
  // before later store updates trigger reactive theme transitions.
  updateThemeQueue = updateThemeQueue
    .then(() => updateTheme(previousActiveTheme, previousIsCustomizableUI))
    .catch((error) => {
      console.error('Initial theme update failed:', error);
    });
  store.themeUpdateQueue = updateThemeQueue;

  /**
   * Updates the active theme by doing the following:
   *    - If theme did not change or is in the process of being loaded, do nothing.
   *    - Else if theme has never been loaded before, import it and then disable the previous theme's styles.
   *    - Else if theme was already loaded, enable its styles and disable the previous theme's styles.
   * @param {UI.Theme} newTheme
   * @param {boolean} newIsCustomizableUI
   * @ignore
   */
  const updateTheme = async (
    newTheme = previousActiveTheme,
    newIsCustomizableUI = previousIsCustomizableUI,
  ) => {
    const internalTheme = getInternalTheme(newTheme, newIsCustomizableUI);
    const isLoading = currentlyLoadingTheme === internalTheme;
    const isActive = previousInternalTheme === internalTheme;
    if (isLoading || isActive) {
      return;
    }

    currentlyLoadingTheme = internalTheme;
    try {
      // Resolve DOM elements within THIS instance's own root (instanceRootNode), not the module-level getRootNode() singleton, since in multi-instance WebComponent mode that singleton always points to the most-recently-registered instance and would otherwise toggle a different instance's theme stylesheets.
      if (previousInternalTheme && !loadedThemes[previousInternalTheme]) {
        searchForThemeElements(previousInternalTheme, loadedThemes, instanceRootNode);
      }
      const isAlreadyLoaded = loadedThemes[internalTheme];
      if (isAlreadyLoaded) {
        enableThemeElements(internalTheme, loadedThemes);
      } else {
        await importTheme(internalTheme);
        // Wait for the link to fully load so the theme is painted before React
        // renders for the first time.
        await waitForThemeLinkLoad(internalTheme, instanceRootNode);
      }

      disableThemeElements(previousInternalTheme, loadedThemes);
      previousInternalTheme = internalTheme;
      previousActiveTheme = newTheme;
      previousIsCustomizableUI = newIsCustomizableUI;
    } finally {
      currentlyLoadingTheme = null;
    }
  };

  store.subscribe(() => {
    const state = store.getState();
    const activeTheme = selectors.getActiveTheme(state);
    const isCustomizableUI = state.featureFlags.customizableUI;

    updateThemeQueue = updateThemeQueue
      .then(() => {
        const shouldUpdateTheme =
          previousActiveTheme !== activeTheme ||
          window.isApryseWebViewerWebComponent ||
          previousIsCustomizableUI !== isCustomizableUI;

        if (shouldUpdateTheme) {
          // Chain the update onto the queue to serialize theme updates
          return updateTheme(activeTheme, isCustomizableUI);
        }
      })
      .catch((error) => {
        console.error('Theme update failed:', error);
      });
    store.themeUpdateQueue = updateThemeQueue;
  });
  return (theme) => {
    const values = Object.values(Theme);
    if (values.indexOf(theme) < 0) {
      throw new Error(`${theme} is not one of: ${values.join(',')}}`);
    }
    store.dispatch(actions.setActiveTheme(theme));
  };
};
