import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

/**
 * Creates a new instance of PageControls. A prebuilt component that allows users to change the page of the document.
 * @name PageControls
 * @memberOf UI.Components
 * @class UI.Components.PageControls
 * @extends UI.Components.Item
 * const pageControls = new UI.Components.PageControls();
 */
class PageControls extends Item {
  constructor(props = {}) {
    super(props);
    this.type = ITEM_TYPE.PAGE_CONTROLS;
    this._dataElement = 'page-controls-container';
  }
}

export default PageControls;