import { ITEM_TYPE, PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';
import Item from './item';

const { checkTypes, TYPES } = window.Core;

/**
 * Creates a new instance of PresetButton.
 * @name PresetButton
 * @memberOf UI.Components
 * @class UI.Components.PresetButton
 * @extends UI.Components.Item
 * @param {Object} properties An object that contains the properties of the PresetButton.
 * @param {string} properties.buttonType The type of the button. Refer to: {@link UI.PRESET_BUTTON_TYPES}
 * @param {string} [properties.dataElement] The data element of the preset button.
 * @param {object} [properties.style] An object defining inline CSS styles for the button, where each key represents a CSS property and its corresponding value.
 * @param {string} [properties.className] String with CSS classes to be applied to the button, allowing additional styling and customization through external stylesheets.
 * @example
const presetButton = new instance.UI.Components.PresetButton({
  buttonType: 'saveAsButton',
  dataElement: 'presetButton-save'
});
 */
class PresetButton extends Item {
  constructor(props) {
    checkTypes([props], [TYPES.OBJECT({
      buttonType: TYPES.ONE_OF(...Object.values(PRESET_BUTTON_TYPES)),
      dataElement: TYPES.OPTIONAL(TYPES.STRING),
    })], 'Preset Button Constructor');
    super(props);
    this.type = ITEM_TYPE.PRESET_BUTTON;
    this.buttonType = props.buttonType;
    this.dataElement = props.dataElement || this.buttonType;
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new PresetButton(propsWithStore);
};