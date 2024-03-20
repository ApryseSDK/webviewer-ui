import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

/**
 * Creates a new instance of ToolButton.
 * @name ToolButton
 * @memberOf UI.Components
 * @class UI.Components.ToolButton
 * @extends UI.Components.Item
 * @property {ItemProperties} properties An object that contains the properties of the ToolButton.
 * @property {string} [properties.label] The label of the button.
 * @property {string} [properties.img] The icon of the button.
 * @property {string} properties.toolName The name of the tool that the button activates. Refer to: {@link Core.Tools.ToolNames}
 * @example
const toolButton = new instance.UI.Components.ToolButton({
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

export default ToolButton;