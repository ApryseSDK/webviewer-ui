import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

class CustomButton extends Item {
  constructor(props) {
    const { isActive, label, img, onClick } = props;
    super(props);
    this.type = ITEM_TYPE.BUTTON;
    this.isActive = isActive;
    this.label = label;
    this.img = img;
    this.onClick = onClick;
    this.type = ITEM_TYPE.BUTTON;
  }
}

export default CustomButton;