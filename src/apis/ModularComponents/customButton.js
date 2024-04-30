import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

/**
 * Creates a new instance of CustomButton.
 * @name CustomButton
 * @memberOf UI.Components
 * @class UI.Components.CustomButton
 * @extends UI.Components.Item
 * @property {ItemProperties} properties An object that contains the properties of the CustomButton.
 * @property {string} [properties.label] The label of the button.
 * @property {string} [properties.img] The icon of the button.
 * @property {function} [properties.onClick] The function that is called when the button is clicked.
 * @property {boolean} [properties.isActive] Whether the button shows an active state or not.
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