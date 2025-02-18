import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

/**
 * Creates a new instance of PageControls. A prebuilt component that allows users to change the page of the document.
 * @name PageControls
 * @memberOf UI.Components
 * @class UI.Components.PageControls
 * @extends UI.Components.Item
 * @property {string} [className] String with CSS classes to be applied to the page controls component, allowing additional styling and customization through external stylesheets.
 * const pageControls = new UI.Components.PageControls();
 */
class PageControls extends Item {
  constructor(props) {
    super(props);
    this.type = ITEM_TYPE.PAGE_CONTROLS;
    this.dataElement = 'page-controls-container';
    this.title = 'component.pageControls';
    this.icon = 'icon-page-controls';
  }

  setStyle() {
    console.warn(
      'PageControls does not support direct style modifications via setStyle(). ' +
      'To customize it, use the className property and define styles in an external stylesheet.'
    );
  }
}

export default PageControls;