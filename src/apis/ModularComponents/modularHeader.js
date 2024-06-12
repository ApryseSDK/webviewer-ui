import actions from 'actions';
import { ITEM_TYPE, DEFAULT_GAP, PLACEMENT, DEFAULT_STYLES } from 'constants/customizationVariables';
import { isGapValid, isJustifyContentValid } from 'components/ModularComponents/Helpers/validation-helper';

const { checkTypes, TYPES } = window.Core;

/**
   * @typedef {Object} ContainerProperties
   * @property {string} [label] The label of the container.
   * @property {string} [dataElement] The data element of the container.
   * @property {'top' | 'bottom' | 'left' | 'right'} [placement] A string that determines the placement of the header.
   * @property {'start' | 'end' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'} [justifyContent] A string that determines the flex justify content value of the container.
   * @property {number} [grow] The flex grow value of the container.
   * @property {number} [gap] The gap between the items in the container.
   * @property {'start' | 'center' | 'end'} [position] A string that determines the position of the container.
   * @property {Array<Object>} [items] The items or other containers within the container.
   * @property {Object} [style] An object that can set the CSS style of the container.
   */
/**
   * Creates a new instance of ModularHeader.
   * @name ModularHeader
   * @memberOf UI.Components
   * @class UI.Components.ModularHeader
   * @param {...ContainerProperties} properties An object that contains the properties of the header
   * @constructor
   * @example
const defaultTopHeader = new instance.UI.Components.ModularHeader({
  dataElement: 'default-top-header',
  placement: 'top',
  grow: 0,
  gap: 12,
  position: 'start',
  stroke: true,
  dimension: {
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 1
  },
  style: {},
  items: [
    // these items would need to be defined in your code
    groupedLeftHeaderButtons,
    ribbonGroup,
  ]
});
*/

export class ModularHeader {
  _store;

  constructor(props) {
    const {
      label,
      dataElement,
      justifyContent,
      grow = 0,
      float = false,
      gap = DEFAULT_GAP,
      position,
      placement,
      opacityMode,
      opacity,
      maxWidth,
      maxHeight,
      items = [],
      style = {},
      stroke = true,
    } = props;
    this.type = ITEM_TYPE.MODULAR_HEADER;
    this.label = label;
    this.dataElement = dataElement;
    this.placement = placement;
    this.justifyContent = justifyContent;
    this.grow = grow;
    this.gap = gap;
    this.position = position;
    this.float = float;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.items = items;
    this.itemValidTypes = Object.values(ITEM_TYPE);
    this.opacityMode = opacityMode;
    this.opacity = opacity;

    this.stroke = stroke;
    this.dimension = {
      paddingTop: DEFAULT_STYLES.PADDING,
      paddingBottom: DEFAULT_STYLES.PADDING,
      borderWidth: DEFAULT_STYLES.WIDTH,
    };

    this.style = this.validateStyle(style);
    this._store = props.store;
  }

  /**
   * Sets the style of the ModularHeader (padding, border, background, etc.)
   * @method UI.Components.ModularHeader#setStyle
   * @param {Object} style An object that can change the CSS style of the ModularHeader
   */
  setStyle(userDefinedStyle) {
    const style = this.validateStyle(userDefinedStyle);
    this.style = style;
    this._store.dispatch(actions.setHeaderStyle(this.dataElement, style));
  }

  validateStyle = (userDefinedStyle) => {
    checkTypes([userDefinedStyle], [TYPES.OPTIONAL([TYPES.OBJECT({
      padding: TYPES.OPTIONAL(TYPES.NUMBER),
      border: TYPES.OPTIONAL(TYPES.STRING),
      borderColor: TYPES.OPTIONAL(TYPES.STRING),
      borderWidth: TYPES.OPTIONAL(TYPES.STRING),
      borderStyle: TYPES.OPTIONAL(TYPES.STRING),
    })])], 'ModularHeader.setStyle');
    if (Object.keys(userDefinedStyle).length === 0) {
      return {};
    }

    // If user pass 'border-style: solid' the stroke should appear
    if (userDefinedStyle.hasOwnProperty('borderStyle')) {
      this.stroke = true;
    }

    const {
      padding,
      border,
    } = userDefinedStyle;

    let {
      borderColor = DEFAULT_STYLES.BORDER_COLOR,
      borderWidth = DEFAULT_STYLES.WIDTH,
      borderStyle = DEFAULT_STYLES.BORDER_STYLE,
    } = userDefinedStyle;

    if (border) {
      const borderParts = border.split(' ');
      if (borderParts.length === 3) {
        [borderWidth, borderStyle, borderColor] = borderParts;
      } else if (borderParts.length === 2) {
        [borderWidth, borderStyle] = borderParts;
      } else if (borderParts.length === 1) {
        [borderWidth] = borderParts;
      }
    }

    if (!padding) {
      return { ...userDefinedStyle };
    }

    // Calculate top & bottom padding for dimensions
    // If it is `padding: '10px'`, top & bottom padding will be 10 padding
    // If it is `padding: '10px 5px 20px'`, top is 10, bottom is 20 padding
    // User also can pass padding like this: `padding: 15`, then top-bottom is 15 padding
    const parsePadding = (paddingStr) => {
      const parts = paddingStr.split(' ').map((part) => parseInt(part, 10));
      return (parts.length <= 2)
        ? { paddingTop: parts[0], paddingBottom: parts[0] }
        : { paddingTop: parts[0], paddingBottom: parts[2] };
    };

    const { paddingTop, paddingBottom } = typeof padding === 'string'
      ? parsePadding(padding) : { paddingTop: padding, paddingBottom: padding };

    this.dimension.paddingTop = paddingTop;
    this.dimension.paddingBottom = paddingBottom;
    this.dimension.borderWidth = parseInt(borderWidth, 10);

    const style = { ...userDefinedStyle };

    // Clear out border direction styles, e.g., borderBottomWidth, borderTopStyle
    // New border styles will be applied according this.placement
    for (const prop in style) {
      if (prop.includes('border')) {
        delete style[prop];
      }
    }

    if (this.stroke) {
      // This function return border style for given placement
      // e.g. if the placement is Right it will return "borderLeftStyle"
      const borderProperty = (prop) => {
        if (this.float) {
          return `border${prop}`;
        }
        let side = '';
        switch (this.placement) {
          case PLACEMENT.LEFT:
            side = 'Right';
            break;
          case PLACEMENT.RIGHT:
            side = 'Left';
            break;
          case PLACEMENT.BOTTOM:
            side = 'Top';
            break;
          case PLACEMENT.TOP:
            side = 'Bottom';
            break;
          default:
            break;
        }
        return `border${side}${prop}`;
      };

      style[borderProperty('Style')] = borderStyle;
      style[borderProperty('Width')] = borderWidth;
      style[borderProperty('Color')] = borderColor;
    }

    return style;
  }

  getDimensionTotal() {
    const { paddingTop, paddingBottom, borderWidth } = this.dimension;
    return paddingTop + paddingBottom + borderWidth;
  }

  /**
   * Sets the gap between items in the ModularHeader
   * @method UI.Components.ModularHeader#setGap
   * @param {number} gap The gap between items in the header
   */
  setGap(gap) {
    if (isGapValid(gap)) {
      this.gap = gap;
      this._store.dispatch(actions.setGapBetweenHeaderItems(this.dataElement, gap));
    }
  }

  // Validates the items type of a grouped item
  validateGroupedItems = (groupedItems) => {
    const items = groupedItems.items || groupedItems.props?.items;
    items?.forEach((item) => {
      this.isItemTypeValid(item);
    });
  };

  /**
   * Returns the grouped items contained in the ModularHeader
   * @method UI.Components.ModularHeader#getGroupedItems
   * @returns {Array<UI.Components.GroupedItems>} The items of the ModularHeader
   */
  getGroupedItems() {
    return this.getItems(ITEM_TYPE.GROUPED_ITEMS);
  }

  /**
   * @typedef {('modularHeader' | 'customButton' | 'statefulButton' | 'groupedItems' | 'ribbonItem' | 'divider' | 'toggleButton' | 'ribbonGroup' | 'toolButton' | 'zoom' | 'flyout' | 'pageControls' | 'presetButton' | 'viewControls' | 'menu' | 'tabPanel')} ItemType
   * Description of allowable item types.
   */

  /**
   * Returns the items contained in the ModularHeader.
   * @method UI.Components.ModularHeader#getItems
   * @param {ItemType} [type] Optional type of the items to be returned.
   * @returns {Array<Object>} The items of the ModularHeader.
   */

  getItems(type) {
    if (type) {
      return this.items.filter((item) => item.type === type);
    }
    return this.items;
  }

  addItemsHelper = (item) => {
    if (this.isItemTypeValid(item)) {
      const clonedItem = Object.assign({}, item);
      this.items.push(clonedItem);
    }
  };

  // Shows a warn if the item type is not valid.
  isItemTypeValid = (item) => {
    if (this.itemValidTypes.includes(item.type)) {
      // case it is a grouped items, validates its items as well
      if (item.type === ITEM_TYPE.GROUPED_ITEMS) {
        this.validateGroupedItems(item);
      }
      return true;
    }
    console.warn(`${item.type} is not a valid item type.`);
    return false;
  };

  /**
   * Sets the items in the ModularHeader
   * @method UI.Components.ModularHeader#setItems
   * @param {Array<Object>} items The items to set in the header
   */
  setItems(newItems) {
    // Ensure newItems is always an array, even if it's a single item
    const itemsArray = Array.isArray(newItems) ? newItems : [newItems];

    // Filter out invalid items and add them to the array
    const itemsToAdd = itemsArray.filter((item) => this.isItemTypeValid(item));

    this.items = itemsToAdd;
    // We dispatch the update; if the header is not yet added to the store, it will ignore the action
    this._store.dispatch(actions.setModularHeaderItems(this.dataElement, itemsToAdd));
  }

  /**
   * Changes the flex justifyContent property of the ModularHeader
   * @method UI.Components.ModularHeader#setJustifyContent
   * @param {'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'} justifyContent A string that determines the flex justify content value of the header
   */
  setJustifyContent(justifyContent) {
    if (isJustifyContentValid(justifyContent)) {
      this.justifyContent = justifyContent;
      this._store.dispatch(actions.setHeaderJustifyContent(this.dataElement, justifyContent));
    }
  }

  // TODO: ADD JS DOC WHEN READY
  // /**
  //  * Changes the max width of the ModularHeader
  //  * @method UI.Components.ModularHeader#setMaxWidth
  //  * @param {number} maxWidth the max width of the header
  //  */
  setMaxWidth(maxWidth) {
    if (isNaN(maxWidth) || maxWidth < 0) {
      console.warn(`${maxWidth} is not a valid value for maxWidth. Please use a number, which represents the maximum width of the header in pixels.`);
      return;
    }
    this.maxWidth = maxWidth;
    this._store.dispatch(actions.setHeaderMaxWidth(this.dataElement, maxWidth));
  }

  // TODO: ADD JS DOC WHEN READY
  // /**
  //  * Changes the max height of the ModularHeader
  //  * @method UI.Components.ModularHeader#setMaxHeight
  //  * @param {number} maxHeight the max height of the header
  //  */
  setMaxHeight(maxHeight) {
    if (isNaN(maxHeight) || maxHeight < 0) {
      console.warn(`${maxHeight} is not a valid value for maxHeight. Please use a number, which represents the maximum height of the header in pixels.`);
      return;
    }
    this.maxHeight = maxHeight;
    this._store.dispatch(actions.setHeaderMaxHeight(this.dataElement, maxHeight));
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new ModularHeader(propsWithStore);
};