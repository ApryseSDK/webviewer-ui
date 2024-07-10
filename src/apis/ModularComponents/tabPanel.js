import { ITEM_TYPE } from 'constants/customizationVariables';
import { panelNames } from 'constants/panel';

const { checkTypes, TYPES } = window.Core;

export const panelItemType = TYPES.OBJECT({
  dataElement: TYPES.OPTIONAL(TYPES.STRING),
  icon: TYPES.OPTIONAL(TYPES.STRING),
  label: TYPES.OPTIONAL(TYPES.STRING),
  render: TYPES.MULTI_TYPE(
    TYPES.FUNCTION,
    TYPES.STRING, // For preset panels
  )
});

export const UNSUPPORTED_PANELS = [panelNames.REDACTION, panelNames.TEXT_EDITING, panelNames.SIGNATURE_LIST, panelNames.RUBBER_STAMP];

/**
 * @typedef {Object} TabPanelItemProperties
 * @property {string} [dataElement] Unique dataElement name for the panel.
 * @property {string} [icon] Path to an image or base64 data. Can also be the filename of a .svg from the WebViewer icons folder found here:
 *   {@link https://github.com/PDFTron/webviewer-ui/tree/master/assets/icons/ assets/icons/} (i.e. `icon-save` to use `icon-save.svg`).
 * @property {string} [label] The label to be displayed for the panel in the Tab Panel.
 * @property {function|string} render The function that renders the panel or the name of the preset panel.
 */

/**
 * @typedef {Object} TabPanelProperties
 * @property {string} dataElement Unique dataElement name for the tab panel.
 * @property {Array<TabPanelItemProperties>} panelsList The list of panels to be displayed in the tab panel.
 * @property {string} [location] The location of the panel. It can be either 'left' or 'right'
 */

/**
 * Creates a new instance of TabPanel.
 * @name TabPanel
 * @memberOf UI.Components
 * @class UI.Components.TabPanel
 * @param {TabPanelProperties} options An object that contains the properties of the tab panel.
 * @example
const tabPanel = new UI.Components.TabPanel({
    dataElement: 'customLeftPanel',
    panelsList: [
      {
        render: UI.Panels.THUMBNAIL
      },
      {
        render: UI.Panels.OUTLINE
      },
      {
        render: UI.Panels.BOOKMARKS
      },
      {
        render: UI.Panels.LAYERS
      },
      {
        render: UI.Panels.SIGNATURE
      },
      {
        render: UI.Panels.FILE_ATTACHMENT
      },
      {
        render: UI.Panels.PORTFOLIO
      }
    ],
    location: 'left'
  });
 */
class TabPanel {
  constructor(props) {
    checkTypes([props], [TYPES.OBJECT({
      dataElement: TYPES.STRING,
      location: TYPES.OPTIONAL(TYPES.STRING),
      panelsList: TYPES.ARRAY(panelItemType),
    })], 'Tab Panel Constructor');
    const { dataElement, panelsList, location } = props;


    const filteredPanelList = [];
    for (const panel of panelsList) {
      if (UNSUPPORTED_PANELS.includes(panel.render)) {
        console.error(`TabPanel: ${panel.render} is not supported in the tab panel`);
      } else {
        filteredPanelList.push(panel);
      }
    }

    this.render = ITEM_TYPE.TABS_PANEL;
    this.dataElement = dataElement;
    this.panelsList = filteredPanelList;
    this.location = location || 'left';
  }
}

export default TabPanel;