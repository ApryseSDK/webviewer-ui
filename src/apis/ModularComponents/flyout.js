import { ITEM_TYPE } from 'constants/customizationVariables';
import selectors from 'selectors';
import actions from 'actions';

const { checkTypes, TYPES } = window.Core;
const flyoutItemTypeBase = {
  label: TYPES.STRING,
  onClick: TYPES.FUNCTION,
  icon: TYPES.OPTIONAL(TYPES.STRING),
};
const flyoutChildType = TYPES.MULTI_TYPE(
  TYPES.OBJECT({ ...flyoutItemTypeBase }),
  TYPES.STRING // For dividers
);
const flyoutItemType = TYPES.MULTI_TYPE(
  TYPES.OBJECT({
    ...flyoutItemTypeBase,
    children: TYPES.OPTIONAL(TYPES.ARRAY(flyoutChildType)),
  }),
  TYPES.STRING // For dividers
);
/**
 * @ignore
 * @name Flyout
 * @memberOf UI.Components
 * @class
 * @constructor
 * @param {Object} options
 * @param {string} options.dataElement
 * @param {Array<Object>} options.items
 * @param {string} options.items.label
 * @param {Function} options.items.onClick
 * @param {string} options.items.icon
 * @param {Array<Object>} options.items.children
 * @param {string} options.items.children.label
 * @param {Function} options.items.children.onClick
 * @param {string} options.items.children.icon
 */
export default (store) => class Flyout {
  properties;

  constructor(options) {
    checkTypes([options], [TYPES.OBJECT({
      dataElement: TYPES.STRING,
      items: TYPES.ARRAY(flyoutItemType),
    })], 'Flyout Constructor');
    const { dataElement } = options;
    this.properties = options;
    this.dataElement = dataElement;
    this.type = ITEM_TYPE.FLYOUT;
  }

  addItems(itemList) {
    checkTypes([itemList], [TYPES.ARRAY(flyoutItemType)], 'Flyout.addItem');
    const flyoutMap = selectors.getFlyoutMap(store.getState());
    if (flyoutMap[this.properties.dataElement]) {
      flyoutMap[this.properties.dataElement].items.push(...itemList);
      this.updateStore();
    }
    this.properties.items.push(...itemList);
  }

  get items() {
    const flyoutMap = selectors.getFlyoutMap(store.getState());
    if (flyoutMap[this.properties.dataElement]) {
      return flyoutMap[this.properties.dataElement].items;
    }
    return this.properties.items;
  }

  set items(newItems) {
    checkTypes([newItems], [TYPES.ARRAY(flyoutChildType)], 'Flyout.initializeFlyoutItem');
    const flyoutMap = selectors.getFlyoutMap(store.getState());
    if (flyoutMap[this.properties.dataElement]) {
      flyoutMap[this.properties.dataElement].items = newItems;
      this.updateStore();
    }
    this.properties.items = newItems;
  }

  updateStore() {
    const flyoutMap = selectors.getFlyoutMap(store.getState());
    store.dispatch(actions.updateFlyout(this.properties.dataElement, flyoutMap[this.properties.dataElement]));
  }
};
