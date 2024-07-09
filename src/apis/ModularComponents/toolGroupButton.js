import { ITEM_TYPE } from 'src/constants/customizationVariables';
import ToggleElementButton from './toggleElementButton';

/**
 * Creates a new instance of ToolGroupButton.
 * @ignore
 * @name ToolGroupButton
 * @memberof UI.Components
 * @class UI.Components.ToolGroupButton
 * @extends UI.Components.ToggleElementButton
 * @property {ItemProperties} properties An object that contains the properties of the ToolGroupButton.
 * @property {string} [properties.toolGroup] The tool group of the element
 * @property {Array<Object>} [properties.tools] The array of tool object
 * @property {string} [properties.toggleElement] The dataElement of the element to toggle.
 * @property {string} [properties.label] The label of the button.
 * @property {string} [properties.img] The title of the button which appears in a tooltip.
 *
 */
class ToolGroupButton extends ToggleElementButton {
  constructor(props) {
    const { label, img, toolGroup, tools } = props;
    super(props);
    this.type = ITEM_TYPE.TOOL_GROUP_BUTTON;
    this.label = label;
    this.img = img;
    this.toolGroup = toolGroup;
    this.tools = tools;
  }
}

export default ToolGroupButton;