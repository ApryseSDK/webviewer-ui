import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';


/**
 * Creates a new instance of CustomButton.
 * @name CustomButton
 * @memberOf UI.Components
 * @class UI.Components.CustomButton
 * @extends UI.Components.Item
 * @param {ItemProperties} options An object that contains the properties of the CustomButton.
 * @param {string} [options.label] The label of the button.
 * @param {string} [options.img] The icon of the button.
 * @param {function} [options.onClick] The function that is called when the button is clicked.
 * @param {boolean} [options.isActive] Whether the button shows an active state or not.
 * @example
const testButton = new instance.UI.Components.CustomButton({
  label: 'test',
  title: 'this is a test button',
  onClick: () => console.log('button clicked!'),
  img: 'icon-save',
});
 */

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