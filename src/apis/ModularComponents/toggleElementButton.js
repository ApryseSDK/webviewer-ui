import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

class ToggleElementButton extends Item {
  constructor(props) {
    const { label, img, toggleElement } = props;
    super(props);
    this.type = ITEM_TYPE.TOGGLE_BUTTON;
    this.label = label;
    this.img = img;
    this.toggleElement = toggleElement;
  }
}

export default ToggleElementButton;