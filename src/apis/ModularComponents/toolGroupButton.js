import { ITEM_TYPE } from 'src/constants/customizationVariables';
import ToggleElementButton from './toggleElementButton';

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