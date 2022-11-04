// The values in this array should match the language codes of the json files inside the i18n folder
const Languages = [
  ['en', 'English'],
  ['el', 'Ελληνικά'],
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
  ['uk', 'українська'],
  ['ru', 'Pусский'],
  ['ro', 'Romanian'],
  ['sv', 'Svenska'],
  ['tr', 'Türk'],
  ['th', 'ไทย'],
  ['vi', 'Tiếng Việt'],
  ['ms', 'Melayu'],
  ['hi', 'हिन्दी'],
  ['bn', 'বাংলা'],
  ['zh_cn', '简体中文'],
  ['zh_tw', '繁體中文'],
  ['cs', 'česky, čeština'],
  ['id', 'Bahasa Indonesia']
];

/**
 * Contains string enums for the default languages found in WebViewer.
 * @name UI.Languages
 * @property {string} EN English (en)
 * @property {string} CS česky, čeština (cs)
 * @property {string} EL Ελληνικά (el)
 * @property {string} DE Deutsch (de)
 * @property {string} ES Español (es)
 * @property {string} FR Français (fr)
 * @property {string} HU Magyar (hu)
 * @property {string} IT Italiano (it)
 * @property {string} JA 日本語 (ja)
 * @property {string} KO 한국어 (ko)
 * @property {string} NL Nederlands (nl)
 * @property {string} PT_BR Português (pt_br)
 * @property {string} PL Polski (pl)
 * @property {string} UK українська (uk)
 * @property {string} RU Pусский (ru)
 * @property {string} RO Romanian (ro)
 * @property {string} SV Svenska (sv)
 * @property {string} TR Türk (tr)
 * @property {string} TH ไทย (th)
 * @property {string} VI Tiếng Việt (vi)
 * @property {string} ID Bahasa Indonesia (id)
 * @property {string} MS Melayu (ms)
 * @property {string} HI हिन्दी (hi)
 * @property {string} BN বাংলা (bn)
 * @property {string} ZH_CN 简体中文 (zh_cn)
 * @property {string} ZH_TW 繁體中文 (zh_tw)
 * @example
  WebViewer(...).then(function(instance) {
    instance.UI.setLanguage(instance.UI.Languages.FR);
  });
 */

export const languageEnum = Languages.reduce((acc, pair) => {
  const code = pair[0];
  acc[code.toUpperCase()] = code;
  return acc;
}, {});

export default Languages;
