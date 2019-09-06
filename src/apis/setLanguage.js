/**
 * Set the language of WebViewer UI.
 * @method WebViewer#setLanguage
 * @param {string} language The language WebViewer UI will use. By default, following languages are supported: en, zh_cn, fr.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.setLanguage('fr'); // set the language to French
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setLanguage('fr'); // set the language to French
});
 */

import i18next from 'i18next';

export default language => {
  i18next.changeLanguage(language);
};
