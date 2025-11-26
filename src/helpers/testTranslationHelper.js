import i18next from 'i18next';

/**
 * Test helper for getting localized text in Storybook tests
 * This allows tests to work across different languages without hardcoding text
 */

/**
 * @ignore
 * Get the translated text for a given translation key
 * @param {string} key - The translation key (e.g., 'action.zoomControls')
 * @param {Object} options - Translation options (optional)
 * @returns {string} The translated text
 */
export const getTranslatedText = (key, options = {}) => {
  return i18next.t(key, options);
};
