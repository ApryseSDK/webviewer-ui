import actions from 'actions';

/**
 * Set custom settings shown in Advanced Setting tab in Settings modal.
 * A custom setting item includes a label, a description, and a toggle button.
 * @method UI.setCustomSettings
 * @param {Array<UI.CustomSettingItem>} customSettings Array of custom setting items.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setCustomSettings([
      {
        label: 'Enable High Contrast Mode',
        description: 'Turns high contrast mode on to help with accessibility.',
        isChecked: () => instance.UI.isHighContrastModeEnabled(),
        onToggled: (enable) => {
          if (enable) {
            instance.UI.enableHighContrastMode();
          } else {
            instance.UI.disableHighContrastMode();
          }
        }
      }
    ]);
  });
 */
export const setCustomSettings = (store) => (customSettings) => {
  store.dispatch(actions.setCustomSettings(customSettings));
};

/**
 * @typedef {Object} UI.CustomSettingItem
 * @property {string} label Custom setting label
 * @property {string} description Custom setting description
 * @property {function|boolean} isChecked Whether the toggle button is checked.
 * @property {function} onToggled The callback function triggered when the toggle button is clicked.
 */
