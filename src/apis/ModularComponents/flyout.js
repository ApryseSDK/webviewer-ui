import { ITEM_TYPE } from 'constants/customizationVariables';
import selectors from 'selectors';
import actions from 'actions';

const { checkTypes, TYPES } = window.Core;
const flyoutItemBase = {
  label: TYPES.STRING,
  onClick: TYPES.FUNCTION,
  icon: TYPES.OPTIONAL(TYPES.STRING),
};
flyoutItemBase.children = TYPES.OPTIONAL(TYPES.ARRAY(
  TYPES.MULTI_TYPE(
    TYPES.OBJECT(flyoutItemBase),
    TYPES.STRING // For dividers
  )
));
const flyoutItemType = TYPES.MULTI_TYPE(
  TYPES.OBJECT(flyoutItemBase),
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
 * @param {Array<UI.Components.Flyout>} options.items.children
 */
export class Flyout {
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
    this.store = options.store;
  }

  addItems(itemList) {
    checkTypes([itemList], [TYPES.ARRAY(flyoutItemType)], 'Flyout.addItem');
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    if (flyoutMap[this.properties.dataElement]) {
      flyoutMap[this.properties.dataElement].items.push(...itemList);
      this.updateStore();
      return;
    }
    this.properties.items.push(...itemList);
  }

  removeItems(itemList) {
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    const currentFlyout = flyoutMap[this.properties.dataElement];
    if (currentFlyout) {
      currentFlyout.items = currentFlyout.items.filter((item) => !itemList.includes(item.dataElement));
      this.updateStore();
    }
  }

  get items() {
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    if (flyoutMap[this.properties.dataElement]) {
      return flyoutMap[this.properties.dataElement].items;
    }
    return this.properties.items;
  }

  set items(newItems) {
    checkTypes([newItems], [TYPES.ARRAY(flyoutItemType)], 'Flyout.initializeFlyoutItem');
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    if (flyoutMap[this.properties.dataElement]) {
      flyoutMap[this.properties.dataElement].items = newItems;
      this.updateStore();
    }
    this.properties.items = newItems;
  }

  updateStore() {
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    this.store.dispatch(actions.updateFlyout(this.properties.dataElement, flyoutMap[this.properties.dataElement]));
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new Flyout(propsWithStore);
};