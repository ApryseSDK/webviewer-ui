import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

/**
 * Creates a new instance of Zoom. A prebuilt feature that allows users to zoom in and out of the document.
 * @name Zoom
 * @memberOf UI.Components
 * @class UI.Components.Zoom
 * @extends UI.Components.Item
 * @example
 * const zoomControls = new UI.Components.Zoom();
 */
class Zoom extends Item {
  constructor(props = {}) {
    super(props);
    this.type = ITEM_TYPE.ZOOM;
    this._dataElement = props.dataElement || 'zoom-container';
  }
}

export default Zoom;