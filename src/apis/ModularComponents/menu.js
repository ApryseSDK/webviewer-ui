import { ITEM_TYPE } from 'constants/customizationVariables';
import selectors from 'selectors';
import { Flyout } from './flyout';

const { checkTypes, TYPES } = window.Core;
const flyoutItemBase = {
  label: TYPES.STRING,
  onClick: TYPES.FUNCTION,
  title: TYPES.OPTIONAL(TYPES.STRING),
  icon: TYPES.OPTIONAL(TYPES.STRING),
};

/**
 * @name MainMenu
 * @memberOf UI.Components
 * @class
 * @constructor
 * @param {Object} options
 * @param {Array<Object>} [options.additionalItems] - An array of extra items to add to the main menu
 */
class MainMenu extends Flyout {
  constructor(props = {}) {
    checkTypes([props], [TYPES.OBJECT({
      additionalItems: TYPES.OPTIONAL(TYPES.ARRAY(TYPES.OBJECT(flyoutItemBase)))
    })], 'Menu Flyout Constructor');
    props.dataElement = 'MainMenuFlyout';
    super(props);
    this.type = ITEM_TYPE.MENU;

    if (props.additionalItems) {
      this.setItems([...this.items, ...props.additionalItems]);
    }
  }
}

export default (store) => (props) => {
  const mainMenuFlyout = selectors.getFlyoutMap(store.getState())['MainMenuFlyout'];
  if (mainMenuFlyout) {
    return new MainMenu({ ...props, items: mainMenuFlyout.items, store });
  }
  const propsWithStore = { ...props, store };
  return new MainMenu(propsWithStore);
};