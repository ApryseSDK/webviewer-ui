// The values in this array should match the language codes of the json files inside the i18n folder
const Languages = [
  ['en', 'English'],
  ['ar', 'العربية'],
  ['bn', 'বাংলা'],
  ['cs', 'česky, čeština'],
  ['de', 'Deutsch'],
  ['el', 'Ελληνικά'],
  ['es', 'Español'],
  ['fa', 'فارسی'],
  ['fr', 'Français'],
  ['he', 'עברית'],
  ['hi', 'हिन्दी'],
  ['hu', 'Magyar'],
  ['id', 'Bahasa Indonesia'],
  ['it', 'Italiano'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['ms', 'Melayu'],
  ['nl', 'Nederlands'],
  ['pl', 'Polski'],
  ['pt_br', 'Português'],
  ['ro', 'Romanian'],
  ['ru', 'Pусский'],
  ['sv', 'Svenska'],
  ['th', 'ไทย'],
  ['tr', 'Türk'],
  ['uk', 'українська'],
  ['ur', 'اردو'],
  ['vi', 'Tiếng Việt'],
  ['zh_cn', '简体中文'],
  ['zh_tw', '繁體中文'],
];

/**
 * Contains string enums for the default languages found in WebViewer.
 * @name UI.Languages
 * @property {string} EN English (en)
 * @property {string} AR العربية (ar)
 * @property {string} BN বাংলা (bn)
 * @property {string} CS česky, čeština (cs)
 * @property {string} DE Deutsch (de)
 * @property {string} EL Ελληνικά (el)
 * @property {string} ES Español (es)
 * @property {string} FA فارسی (fa)
 * @property {string} FR Français (fr)
 * @property {string} HE עברית (he)
 * @property {string} HI हिन्दी (hi)
 * @property {string} HU Magyar (hu)
 * @property {string} ID Bahasa Indonesia (id)
 * @property {string} IT Italiano (it)
 * @property {string} JA 日本語 (ja)
 * @property {string} KO 한국어 (ko)
 * @property {string} MS Melayu (ms)
 * @property {string} NL Nederlands (nl)
 * @property {string} PL Polski (pl)
 * @property {string} PT_BR Português (pt_br)
 * @property {string} RO Romanian (ro)
 * @property {string} RU Pусский (ru)
 * @property {string} SV Svenska (sv)
 * @property {string} TH ไทย (th)
 * @property {string} TR Türk (tr)
 * @property {string} UK українська (uk)
 * @property {string} UR اردو (ur)
 * @property {string} VI Tiếng Việt (vi)
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
