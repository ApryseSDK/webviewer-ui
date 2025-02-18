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
 * @param {object} [properties.style] An object defining inline CSS styles for the button, where each key represents a CSS property and its corresponding value.
 * @param {string} [properties.className] String with CSS classes to be applied to the button, allowing additional styling and customization through external stylesheets.
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

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new CustomButton(propsWithStore);
};