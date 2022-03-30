// The values in this array should match the language codes of the json files inside the i18n folder
export const languages = [
  ['en', 'English'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['it', 'Italiano'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['nl', 'Nederlands'],
  ['pt_br', 'Português'],
  ['ru', 'Pусский'],
  ['zh_cn', '简体中文'],
  ['zh_tw', '繁體中文'],
  ['vi', 'Tiếng Việt']
];

export const availableLanguages = languages.map(language => language[0]);

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
