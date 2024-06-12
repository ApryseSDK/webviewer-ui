import actions from 'actions';
import { ITEM_TYPE, DEFAULT_GAP } from 'constants/customizationVariables';
import { isGapValid, isGrowValid, isJustifyContentValid } from 'components/ModularComponents/Helpers/validation-helper';

const { checkTypes, TYPES } = window.Core;

export class GroupedItems {
  /**
   * Creates a new instance of GroupedItems.
   * @name GroupedItems
   * @memberOf UI.Components
   * @class UI.Components.GroupedItems
   * @constructor
   * @param {ContainerProperties} properties  An object that contains the properties of the grouped items.
   * @param {string} [properties.dataElement] The data element of the grouped item.
   * @param {'top' | 'bottom' | 'left' | 'right'} [properties.placement] A string that determines the placement of the header.
   * @param {'start' | 'end' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'} [properties.justifyContent] A string that determines the flex justify content value of the grouped items container.
   * @param {number} [properties.grow] The flex grow value of the grouped items container.
   * @param {number} [properties.gap] The gap between the items in the grouped items container.
   * @param {'start' | 'center' | 'end'} [properties.position] A string that determines the position of the grouped items container.
   * @param {boolean} [properties.alwaysVisible]  Whether the group should always be visible or not. Default is false. Alternatively, visibility can be toggled by changing the active grouped item using a Ribbon Item.
   * @param {Object} [properties.style] An object that can set the CSS style of the grouped items.
   * @param {Array<Object>} [properties.items] The items within the grouped items container. The valid items are: {@link UI.Components.ModularHeader}, {@link UI.Components.CustomButton}, {@link UI.Components.StatefulButton}, {@link UI.Components.GroupedItems}, {@link UI.Components.RibbonItem}, {@link UI.Components.ToggleElementButton}, {@link UI.Components.RibbonGroup}, {@link UI.Components.ToolButton}, {@link UI.Components.Zoom}, {@link UI.Components.Flyout}, {@link UI.Components.PageControls}, {@link UI.Components.PresetButton}, {@link UI.Components.ViewControls}, {@link UI.Components.TabPanel}.
   * @example
const groupedLeftHeaderButtons = new instance.UI.Components.GroupedItems({
  dataElement: 'groupedLeftHeaderButtons',
  grow: 0,
  gap: 12,
  position: 'start',
  style: {},
  items: [
    // these items would need to be defined in your code
    leftHeaderButton1,
    leftHeaderButton2,
    leftHeaderButton3
  ],
  alwaysVisible: true,
});
   */
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

  /**
   * Sets the gap between items in the GroupedItems
   * @method UI.Components.GroupedItems#setGap
   * @param {number} gap The gap in pixels between the items in the group.
   */
  setGap(gap) {
    if (isGapValid(gap)) {
      this._gap = gap;
      this.store.dispatch(actions.setModularComponentProperty('gap', gap, this.dataElement));
    }
  }

  /**
   * Sets the style of the GroupedItems (padding, border, background, etc.)
   * @method UI.Components.GroupedItems#setStyle
   * @param {Object} style An object that can change the CSS style of the group.
   * @example
    groupedItems.setStyle({
      background: 'aliceblue',
      border: '8px dashed',
      padding: '8px 12px'
    });
   */
  setStyle(style) {
    checkTypes([style], [TYPES.OBJECT({})], 'GroupedItem.setStyle');
    this.style = style;
    this.store.dispatch(actions.setModularComponentProperty('style', style, this.dataElement));
  }

  /**
   * Sets the flex justifyContent property of the GroupedItems
   * @method UI.Components.GroupedItems#setJustifyContent
   * @param {'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'} justifyContent A string that determines the flex justify content value of the group
   */
  setJustifyContent(justifyContent) {
    if (isJustifyContentValid(justifyContent)) {
      this._justifyContent = justifyContent;
      this.store.dispatch(actions.setModularComponentProperty('justifyContent', justifyContent, this.dataElement));
    }
  }

  /**
   * Sets the flex grow property of the GroupedItems
   * @method UI.Components.GroupedItems#setGrow
   * @param {number} grow The flex grow value of the group
   */
  setGrow(grow) {
    if (isGrowValid(grow)) {
      this._grow = grow;
      this.store.dispatch(actions.setModularComponentProperty('grow', grow, this.dataElement));
    }
  }

  /**
   * Sets the items in the GroupedItems
   * @method UI.Components.GroupedItems#setItems
   * @param {Array<Object>} items The items to set in the group.
   */
  setItems(items) {
    checkTypes([items], [TYPES.ARRAY(TYPES.ANY)], 'GroupedItems.setItems');
    this.items = items;
    this.store.dispatch(actions.updateGroupedItems(this.dataElement, items));
  }

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