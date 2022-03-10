// The values in this array should match the language codes of the json files inside the i18n folder
export const availableLanguages = [
  'en',
  'de',
  'es',
  'fr',
  'it',
  'ja',
  'ko',
  'nl',
  'pt_br',
  'ru',
  'vi',
  'zh_cn',
  'zh_tw'
];

/**
 * Returns all available languages as a list.
 * @method UI.getAvailableLanguages
 * @return {Array<string>} All available languages
 * @example
WebViewer(...)
  .then(function(instance) {
    console.log(instance.UI.getAvailableLanguages());
  });
 */
export default () => {
  return availableLanguages;
};
