import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

/**
 * Creates a new instance of ToolGroupToggleButton
 * @name ToolGroupToggleButton
 * @memberOf UI.Components
 * @class UI.Components.ToolGroupToggleButton
 * @extends UI.Components.Item
 * @param {Object} properties An object that contains the properties of the ToolGroupToggleButton
 * @param {string} [properties.dataElement] The data element of the button
 * @param {string} [properties.label] The label of the button
 * @param {string} [properties.img] The icon of the button
 * @param {object} [properties.style] An object defining inline CSS styles for the tool button, where each key represents a CSS property and its corresponding value
 * @param {string} [properties.className] String with CSS classes to be applied to the tool button, allowing additional styling and customization through external stylesheets
 * @param {string} properties.groupedItems The name of the groupedItems element that this toggle button will control. When the button is toggled on, it will activate the last picked tool in this group.
 * @param {boolean} [properties.shouldToggleVisibility=true] Determines whether the visibility of the tools in the group should be toggled when the button is clicked

 * @example
const customEllipseToolGroupToggleButton = new UI.Components.ToolGroupToggleButton({
  dataElement: 'customEllipseToolGroupToggleButton',
  groupedItems: 'customEllipseGroupedItems',
  shouldToggleVisibility: true,
});
 */
class ToolGroupToggleButton extends Item {
  constructor(props) {
    const { isActive, label, img, onClick, groupedItems, color, shouldToggleVisibility = true } = props;
    super(props);
    this.type = ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON;
    this.isActive = isActive;
    this.label = label;
    this.img = img;

    if (onClick) {
      this.onClick = onClick;
    }
    this.groupedItems = groupedItems;
    this.color = color;
    this.shouldToggleVisibility = shouldToggleVisibility;
  }
}

export default function createToolGroupToggleButtonFactory(store) {
  return function toolGroupToggleButtonFactory(props) {
    const propsWithStore = { ...props, store };
    return new ToolGroupToggleButton(propsWithStore);
  };
}