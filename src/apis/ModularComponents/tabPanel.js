import { ITEM_TYPE } from 'constants/customizationVariables';
import { panelNames } from 'constants/panel';

const { checkTypes, TYPES } = window.Core;

const panelItemType = TYPES.OBJECT({
  dataElement: TYPES.STRING,
  icon: TYPES.OPTIONAL(TYPES.STRING),
  label: TYPES.OPTIONAL(TYPES.STRING),
  render: TYPES.MULTI_TYPE(
    TYPES.FUNCTION,
    TYPES.STRING, // For preset panels
  )
});

const UNSUPPORTED_PANELS = [panelNames.REDACTION, panelNames.TEXT_EDITING, panelNames.SIGNATURE_LIST, panelNames.RUBBER_STAMP];

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