import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';
/**
 * Creates a new instance of ViewControls. A prebuilt feature that allows users to change the Page Transition, Orientation, and Layout of the document.
 * @name ViewControls
 * @memberOf UI.Components
 * @class UI.Components.ViewControls
 * @extends UI.Components.Item
 * @example
 * const viewControlsToggle = new UI.Components.ViewControls();
 */
class ViewControls extends Item {
  constructor(props = {}) {
    super(props);
    this.type = ITEM_TYPE.VIEW_CONTROLS;
    this._dataElement = 'view-controls';
  }
}

export default ViewControls;