import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

const { checkTypes, TYPES } = window.Core;

/**
 * Creates a new instance of CustomButton.
 * @name CustomButton
 * @memberOf UI.Components
 * @class UI.Components.CustomButton
 * @extends UI.Components.Item
 * @param {Object} options An object that contains the properties of the CustomButton.
 * @param {string} [options.dataElement] The data element of the button.
 * @param {string} [options.label] The label of the button.
 * @param {string} [options.title] The title of the button.
 * @param {string} [options.img] The icon of the button.
 * @param {function} [options.onClick] The function that is called when the button is clicked.
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
    checkTypes([props], [TYPES.OBJECT({
      dataElement: TYPES.STRING,
      label: TYPES.OPTIONAL(TYPES.STRING),
      img: TYPES.OPTIONAL(TYPES.STRING),
    })], 'Custom Button Constructor');
    const { label, img, onClick } = props;
    super(props);
    this.type = ITEM_TYPE.BUTTON;
    this.label = label;
    this.img = img;
    this.onClick = onClick;
    this.type = ITEM_TYPE.BUTTON;
  }
}

export default CustomButton;