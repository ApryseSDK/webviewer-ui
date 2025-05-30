import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

/**
 * Creates a new instance of ToolButton.
 * @name ToolButton
 * @memberOf UI.Components
 * @class UI.Components.ToolButton
 * @extends UI.Components.Item
 * @param {Object} properties An object that contains the properties of the ToolButton.
 * @param {string} [properties.dataElement] The data element of the button.
 * @param {string} [properties.label] The label of the button.
 * @param {string} [properties.img] The icon of the button.
 * @param {Core.Tools.ToolNames | string} [properties.toolName] The name of the tool that the button activates. Refer to: {@link Core.Tools.ToolNames}
 * @param {object} [properties.style] An object defining inline CSS styles for the tool button, where each key represents a CSS property and its corresponding value.
 * @param {string} [properties.className] String with CSS classes to be applied to the tool button, allowing additional styling and customization through external stylesheets.

 * @example
const toolButton = new instance.UI.Components.ToolButton({
  dataElement: 'pan-tool-button',
  label: 'Pan',
  title: 'Pan the document',
  img: 'icon-header-pan',
  toolName: 'Pan',
});
 */
class ToolButton extends Item {
  constructor(props) {
    const { isActive, label, img, onClick, toolName, color } = props;
    super(props);
    this.type = ITEM_TYPE.TOOL_BUTTON;
    this.isActive = isActive;
    this.label = label;
    this.img = img;

    if (onClick) {
      this.onClick = onClick;
    }
    this.toolName = toolName;
    this.color = color;
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new ToolButton(propsWithStore);
};