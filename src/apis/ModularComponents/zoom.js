import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

/**
 * Creates a new instance of Zoom. A prebuilt feature that allows users to zoom in and out of the document.
 * @name Zoom
 * @memberOf UI.Components
 * @class UI.Components.Zoom
 * @extends UI.Components.Item
 * @property {string} [className] String with CSS classes to be applied to the zoom element, allowing additional styling and customization through external stylesheets.
 * @example
 * const zoomControls = new UI.Components.Zoom();
 */
class Zoom extends Item {
  constructor(props) {
    super(props);
    this.type = ITEM_TYPE.ZOOM;
    this.dataElement = props.dataElement || 'zoom-container';
  }

  setStyle() {
    console.warn(
      'Zoom component does not support direct style modifications via setStyle(). ' +
      'To customize it, use the className property and define styles in an external stylesheet.'
    );
  }
}

export default Zoom;