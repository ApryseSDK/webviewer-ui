import Languages from 'constants/languages';

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
export default () => Languages.map((language) => language[0]);
