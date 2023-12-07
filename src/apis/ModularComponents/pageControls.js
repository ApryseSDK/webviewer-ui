import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

class PageControls extends Item {
  constructor(props = {}) {
    super(props);
    this.type = ITEM_TYPE.PAGE_CONTROLS;
    this.dataElement = 'page-controls-container';
  }
}

export default PageControls;