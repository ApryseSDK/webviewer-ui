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
 * @param {string} [properties.dataElement] The data element of the preset button.
 * @param {string} [properties.buttonType] The type of the button. Refer to: {@link UI.PRESET_BUTTON_TYPES}
 * @example
const presetButton = new instance.UI.Components.PresetButton({
  buttonType: 'saveAsButton',
  dataElement: 'presetButton-save'
});
 */
class PresetButton extends Item {
  constructor(props = {}) {
    checkTypes([props], [TYPES.OBJECT({
      buttonType: TYPES.ONE_OF(...Object.values(PRESET_BUTTON_TYPES)),
      dataElement: TYPES.OPTIONAL(TYPES.STRING),
    })], 'Preset Button Constructor');
    super(props);
    this.type = ITEM_TYPE.PRESET_BUTTON;
    this.buttonType = props.buttonType;
    this._dataElement = props.dataElement || this.buttonType;
  }
}

export default PresetButton;