// The values in this array should match the language codes of the json files inside the i18n folder
export const languages = [
  ['en', 'English'],
  ['cs', 'česky, čeština'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['hu', 'Magyar'],
  ['it', 'Italiano'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['nl', 'Nederlands'],
  ['pt_br', 'Português'],
  ['pl', 'Polski'],
  ['ru', 'Pусский'],
  ['ro', 'Romanian'],
  ['sv', 'Svenska'],
  ['th', 'ไทย'],
  ['vi', 'Tiếng Việt'],
  ['zh_cn', '简体中文'],
  ['zh_tw', '繁體中文'],
];

export const availableLanguages = languages.map((language) => language[0]);

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
