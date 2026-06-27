import getCurrentT from 'helpers/getCurrentT';

/**
 * Return the localized text for the given key. This functions exactly the same as the <b>t</b> API from the <b>i18n</b> library.
 * <br/>
 * This may be used to leverage the existing localization setup in WebViewer in custom elements, modals, etc.
 * @method UI.getLocalizedText
 * @return {string|Array<string>} The translation key
 * @example
WebViewer(...)
  .then(function(instance) {
    const buttonOptions = {
      dataElement: 'customAddButton',
      type: 'button',
      title: 'Add',
      label: 'Add',
    }
    const button = new instance.UI.Components.CustomButton(buttonOptions);
    const header = instance.UI.getModularHeader('default-top-header');
    const headerItems = header.getItems();
    header.setItems([...headerItems, button]);

    instance.UI.addEventListener(instance.UI.Events.LANGUAGE_CHANGED, () => {
        const newText = instance.UI.getLocalizedText('action.add');
        buttonOptions.title = newText;
        buttonOptions.label = newText;

        // Manually update components
        const headerItems = header.getItems();
        const newButton = new instance.UI.Components.CustomButton(buttonOptions);
        headerItems[headerItems.length - 1] = newButton;
        header.setItems([...headerItems]);
    });

    instance.UI.setLanguage(instance.UI.Languages.FR);
    // The button text will be 'Ajouter' (French) instead of 'Add' (English)
  });
 */

const getLocalizedText = (key) => getCurrentT()(key);

export default getLocalizedText;
