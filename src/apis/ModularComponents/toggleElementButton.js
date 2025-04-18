import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';


/**
 * Creates a new instance of ToggleElementButton.
 * @name ToggleElementButton
 * @memberOf UI.Components
 * @class UI.Components.ToggleElementButton
 * @extends UI.Components.Item
 * @param {Object} properties An object that contains the properties of the ToggleElementButton.
 * @param {string} [properties.dataElement] The dataElement of toggle button.
 * @param {string} properties.toggleElement The dataElement of the element to toggle.
 * @param {string} [properties.title] The tooltip text to be displayed when hovering over the toggle button.
 * @param {string} [properties.label] The label of the button.
 * @param {string} [properties.img] The title of the button which appears in a tooltip.
 * @param {object} [properties.style] An object defining inline CSS styles for the button, where each key represents a CSS property and its corresponding value.
 * @param {string} [properties.className] String with CSS classes to be applied to the button, allowing additional styling and customization through external stylesheets.
 * @example
const toggleButton = new instance.UI.Components.ToggleElementButton({
  label: 'Toggle',
  title: 'Toggle the visibility of the element',
  img: 'icon-save',
  toggleElement: 'elementToToggle',
});
 */
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

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new ToggleElementButton(propsWithStore);
};