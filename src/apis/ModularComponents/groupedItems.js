import actions from 'actions';
import { ITEM_TYPE, DEFAULT_GAP } from 'constants/customizationVariables';
import { isGapValid, isGrowValid, isJustifyContentValid } from 'components/ModularComponents/Helpers/validation-helper';

const { checkTypes, TYPES } = window.Core;

export class GroupedItems {
  constructor(props) {
    const {
      label,
      dataElement,
      justifyContent,
      grow = 0,
      gap = DEFAULT_GAP,
      position,
      placement,
      items = [],
      alwaysVisible = false,
      style = {},
    } = props;
    this.label = label;
    this.dataElement = dataElement;
    this.placement = placement;
    this._justifyContent = justifyContent;
    this._grow = grow;
    this._gap = gap;
    this.position = position;
    this.items = items;
    this.type = ITEM_TYPE.GROUPED_ITEMS;
    this.alwaysVisible = alwaysVisible;
    this.style = style;
    this.store = props.store;
  }

  setGap = (gap) => {
    if (isGapValid(gap)) {
      this._gap = gap;
      this.store.dispatch(actions.setGroupedItemsProperty('gap', gap, this.dataElement));
    }
  };

  setStyle = (style) => {
    checkTypes([style], [TYPES.OBJECT({})], 'GroupedItem.setStyle');
    this.style = style;
    this.store.dispatch(actions.setGroupedItemsProperty('style', style, this.dataElement));
  };

  setJustifyContent = (justifyContent) => {
    if (isJustifyContentValid(justifyContent)) {
      this._justifyContent = justifyContent;
      this.store.dispatch(actions.setGroupedItemsProperty('justifyContent', justifyContent, this.dataElement));
    }
  };

  setGrow = (grow) => {
    if (isGrowValid(grow)) {
      this._grow = grow;
      this.store.dispatch(actions.setGroupedItemsProperty('grow', grow, this.dataElement));
    }
  };

  setItems = (items) => {
    checkTypes([items], [TYPES.ARRAY(TYPES.ANY)], 'GroupedItems.setItems');
    this.items = items;
    this.store.dispatch(actions.updateGroupedItems(this.dataElement, items));
  };

  getGroupedItemProperty = (property) => {
    const state = this.store.getState();
    if (state && state.viewer && state.viewer.modularComponents) {
      const component = state.viewer.modularComponents[this.dataElement];
      if (component && component.hasOwnProperty(property)) {
        return component[property];
      }
    }
    // If the component is not yet in redux we return the property that we have in the class
    return this[`_${property}`];
  }

  get gap() {
    return this.getGroupedItemProperty('gap');
  }

  set gap(gap) {
    this.setGap(gap);
  }

  get justifyContent() {
    return this.getGroupedItemProperty('justifyContent');
  }

  set justifyContent(justifyContent) {
    this.setJustifyContent(justifyContent);
  }

  get grow() {
    return this.getGroupedItemProperty('grow');
  }

  set grow(grow) {
    this.setGrow(grow);
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new GroupedItems(propsWithStore);
};