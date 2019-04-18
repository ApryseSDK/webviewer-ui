/**
 * Set the language of WebViewer UI.
 * @method WebViewer#setLanguage
 * @param {string} language The language WebViewer UI will use. By default, following languages are supported: en, zh_cn, fr.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.setLanguage('fr'); // set the language to French
 */

import i18next from 'i18next';

export default language =>  {
  i18next.changeLanguage(language);
};
