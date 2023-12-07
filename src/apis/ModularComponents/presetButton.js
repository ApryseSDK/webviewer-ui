import { ITEM_TYPE, PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';
import Item from './item';

const { checkTypes, TYPES } = window.Core;

class PresetButton extends Item {
  constructor(props = {}) {
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

export default PresetButton;