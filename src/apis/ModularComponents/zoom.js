import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

class Zoom extends Item {
  constructor(props = {}) {
    super(props);
    this.type = ITEM_TYPE.ZOOM;
    this.dataElement = 'zoom-container';
  }
}

export default Zoom;