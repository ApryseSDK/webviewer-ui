import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

class ViewControls extends Item {
  constructor(props = {}) {
    super(props);
    this.type = ITEM_TYPE.VIEW_CONTROLS;
    this.dataElement = 'view-controls';
  }
}

export default ViewControls;