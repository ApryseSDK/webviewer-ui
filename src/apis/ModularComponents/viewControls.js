import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

/**
 * Creates a new instance of ViewControls. A prebuilt feature that allows users to change the Page Transition, Orientation, and Layout of the document.
 * @name ViewControls
 * @memberOf UI.Components
 * @class UI.Components.ViewControls
 * @extends UI.Components.Item
 * @property {string} [className] String with CSS classes to be applied to the view controls element, allowing additional styling and customization through external stylesheets.
 * @example
 * const viewControlsToggle = new UI.Components.ViewControls();
 */
class ViewControls extends Item {
  constructor(props) {
    super(props);
    this.type = ITEM_TYPE.VIEW_CONTROLS;
    this.dataElement = 'view-controls';
    this.title = 'component.viewControls';
    this.icon = 'icon-header-page-manipulation-line';
  }

  setStyle() {
    console.warn(
      'ViewControls does not support direct style modifications via setStyle(). ' +
      'To customize it, use the className property and define styles in an external stylesheet.'
    );
  }
}

export default ViewControls;