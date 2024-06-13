import { ITEM_TYPE, PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { Flyout } from './flyout';
import DataElements from 'constants/dataElement';
import { menuItems } from 'components/ModularComponents/Helpers/menuItems';

/**
 * @name MainMenu
 * @memberOf UI.Components
 * @class
 * @extends UI.Components.Flyout
 * @constructor
 * @param {Object} [options] - An object that contains the properties of the main menu
 * @param {Array<Object>} [options.additionalItems] - An array of extra items to add to the main menu
 * @param {Object} [options.dataElement] - The data element for the main menu flyout
 */
class MainMenu extends Flyout {
  constructor(options = {}) {
    if (!options.dataElement) {
      options.dataElement = DataElements.MAIN_MENU;
    }
    super(options);
    this.items = [...options.defaultItems, ...this.items];
    options.additionalItems = undefined;
    options.defaultItems = undefined;
  }
}

export default (store) => (props) => {
  const defaultItems = [
    {
      ...menuItems[PRESET_BUTTON_TYPES.NEW_DOCUMENT],
      type: ITEM_TYPE.PRESET_BUTTON,
    },
    {
      ...menuItems[PRESET_BUTTON_TYPES.FILE_PICKER],
      type: ITEM_TYPE.PRESET_BUTTON,
    },
    {
      ...menuItems[PRESET_BUTTON_TYPES.DOWNLOAD],
      type: ITEM_TYPE.PRESET_BUTTON,
    },
    {
      ...menuItems[PRESET_BUTTON_TYPES.FULLSCREEN],
      type: ITEM_TYPE.PRESET_BUTTON,
    },
    {
      ...menuItems[PRESET_BUTTON_TYPES.SAVE_AS],
      type: ITEM_TYPE.PRESET_BUTTON,
    },
    {
      ...menuItems[PRESET_BUTTON_TYPES.PRINT],
      type: ITEM_TYPE.PRESET_BUTTON,
    },
    'divider',
    {
      ...menuItems[PRESET_BUTTON_TYPES.CREATE_PORTFOLIO],
      type: ITEM_TYPE.PRESET_BUTTON,
    },
    'divider',
    {
      ...menuItems[PRESET_BUTTON_TYPES.SETTINGS],
      type: ITEM_TYPE.PRESET_BUTTON,
    },
    'divider',
  ];
  return new MainMenu({
    ...props,
    items: props.additionalItems || [],
    store,
    defaultItems,
  });
};