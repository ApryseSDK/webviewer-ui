/**
 * Add/Edit translations data for a specific language.
 * @method UI.setTranslations
 * @param {string} language The language code for which you want to add/edit translation data.
 * @param {Object<string, string>} translationObject <p> A key/value object with the new/updated translations. </p>
 * <p> The key values of the translation object will be the translation key for the new/updated translation.
 * Refer to the lib/ui/i18n folder to find the existing keys in the translation files.</p>
 * <p> The values of the translation object will be the value of the new/updated translation.</p>
 *
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setTranslations('es',
    {
      'option.colorPalette.colorLabel': 'Etiqueta de color', //updates a pre-existing translation data
      'action.newButton': 'Nuevo botón' // adds a new translation data
    });
  });
 */

import i18next from 'i18next';


const overridesByInstance = new WeakMap();

const applyOverrides = (i18n, language) => {
  const overrides = overridesByInstance.get(i18n)?.get(language);
  if (!overrides) {
    return;
  }
  i18n.addResources(language, 'translation', overrides);
  if (i18n !== i18next && i18next.isInitialized) {
    i18next.addResources(language, 'translation', overrides);
  }
};

export default (instanceI18n) => (language, translationObject) => {
  const i18n = instanceI18n || i18next;

  let overrides = overridesByInstance.get(i18n);
  if (!overrides) {
    overrides = new Map();
    overridesByInstance.set(i18n, overrides);
    i18n.on('loaded', () => overrides.forEach((_, lng) => applyOverrides(i18n, lng)));
  }

  overrides.set(language, { ...overrides.get(language), ...translationObject });
  i18n.reloadResources([language]);
  applyOverrides(i18n, language);
};