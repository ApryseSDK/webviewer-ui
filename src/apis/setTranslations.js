/**
 * Add/Edit translations data for a specific language
 * @method UI.setTranslations
 * @param {string} language The language code for which you want to add/edit translation data
 * @param {Object<string, string>} translationObject <p> A key/value object with the new/updated translations. </p>
 * <p> The key values of the translation object will be the translation key for the new/updated translation.
 * Refer to the lib/ui/i18n folder to find the existing keys in the translation files </p>
 * <p> The values of the translation object will be the value of the new/updated translation</p>
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

export default (language, translationObject) => {
  i18next.on('loaded', () => {
    i18next.addResources(
      language,
      'translation',
      translationObject
    );
  });

  i18next.reloadResources([language]);
};