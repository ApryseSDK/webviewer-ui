import { ITEM_TYPE } from 'constants/customizationVariables';

const { checkTypes, TYPES } = window.Core;

const panelItemType = TYPES.OBJECT({
  dataElement: TYPES.OPTIONAL(TYPES.STRING),
  icon: TYPES.OPTIONAL(TYPES.STRING),
  label: TYPES.OPTIONAL(TYPES.STRING),
  render: TYPES.MULTI_TYPE(
    TYPES.FUNCTION,
    TYPES.STRING, // For preset panels
  )
});

class TabPanel {
  constructor(props) {
    checkTypes([props], [TYPES.OBJECT({
      dataElement: TYPES.STRING,
      location: TYPES.OPTIONAL(TYPES.STRING),
      panelsList: TYPES.ARRAY(panelItemType),
    })], 'Tab Panel Constructor');

    const { dataElement, panelsList, location } = props;
    this.render = ITEM_TYPE.TABS_PANEL;
    this.dataElement = dataElement;
    this.panelsList = panelsList;
    this.location = location || 'left';
  }
}

export default TabPanel;