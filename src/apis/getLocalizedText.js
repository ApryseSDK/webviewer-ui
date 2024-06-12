import i18next from 'i18next';

/**
 * Return the localized text for the given key. This functions exactly the same as the <b>t</b> API from the <b>i18n</b> library.
 * <br/>
 * This may be used to leverage the existing localization setup in WebViewer in custom elements, modals, etc.
 * @method UI.getLocalizedText
 * @return {string|Array<string>} The translation key
 * @example
WebViewer(...)
  .then(function(instance) {
    const button = document.createElement('button');
    button.innerText = instance.UI.getLocalizedText('action.add');

    instance.UI.setHeaderItems(header => {
      const renderButton = () => button;

      const newCustomElement = {
        type: 'customElement',
        title: 'action.add',
        render: renderButton
      };
      header.push(newCustomElement);
    });

    instance.UI.addEventListener(instance.UI.Events.LANGUAGE_CHANGED, () => {
        // Manually update components
        button.innerText = instance.UI.getLocalizedText('action.add');
    });

    instance.UI.setLanguage(instance.UI.Languages.FR);
    // The button text will be 'Ajouter' (French) instead of 'Add' (English)
  });
 */

const getLocalizedText = (key) => i18next.t(key);

export default getLocalizedText;
