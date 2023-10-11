import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

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