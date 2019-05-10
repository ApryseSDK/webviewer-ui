/**
 * Set the language of WebViewer UI.
 * @method WebViewer#setLanguage
 * @param {string} language The language WebViewer UI will use. By default, following languages are supported: en, zh_cn, fr.
 * @example // Set the language to French
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setLanguage('fr');
});
 */

import i18next from 'i18next';

export default language =>  {
  i18next.changeLanguage(language);
};
