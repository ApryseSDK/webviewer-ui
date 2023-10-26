import actions from 'actions';
import { ITEM_TYPE, JUSTIFY_CONTENT, DEFAULT_GAP, PLACEMENT, DEFAULT_STYLES } from 'constants/customizationVariables';

export default (store) => (props) => {
  class ModularHeader {
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
      // items is a list of things. We want to clone them
      this.items = items.map((item) => ({ ...item }));
      this.itemValidTypes = Object.values(ITEM_TYPE);
      this.opacityMode = opacityMode;
      this.opacity = opacity;

      this.stroke = stroke;
      this.dimension = {
        paddingTop: DEFAULT_STYLES.PADDING,
        paddingBottom: DEFAULT_STYLES.PADDING,
        borderWidth: DEFAULT_STYLES.WIDTH,
      };

      this.setStyle(style);
    }

    setStyle(userDefinedStyle) {
      if (Object.keys(userDefinedStyle).length === 0) {
        this.style = {};
        return;
      }

      // If user pass 'border-style: solid' the stroke should appear
      if (userDefinedStyle.hasOwnProperty('borderStyle')) {
        this.stroke = true;
      }

      const {
        padding,
        borderColor = DEFAULT_STYLES.BORDER_COLOR,
        borderWidth = DEFAULT_STYLES.WIDTH,
        borderStyle = DEFAULT_STYLES.BORDER_STYLE,
      } = userDefinedStyle;

      if (!padding) {
        this.style = { ...userDefinedStyle };
        return;
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

      this.style = style;
    }

    getDimensionTotal() {
      const { paddingTop, paddingBottom, borderWidth } = this.dimension;
      return paddingTop + paddingBottom + borderWidth;
    }

    setGap(gap) {
      this.gap = gap;
      // What if the header already exists in redux? we must update it
      store.dispatch(actions.setGapBetweenHeaderItems(this.dataElement, gap));
    }

    // Validates the items type of a grouped item
    validateGroupedItems = (groupedItems) => {
      const items = groupedItems.items || groupedItems.props?.items;
      items?.forEach((item) => {
        this.isItemTypeValid(item);
      });
    };

    getGroupedItems() {
      return this.getItems(ITEM_TYPE.GROUPED_ITEMS);
    }

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

    addItems = (newItem) => {
      const state = store.getState();

      if (Array.isArray(newItem)) {
        newItem.forEach((item) => {
          this.addItemsHelper(item);
        });
      } else {
        this.addItemsHelper(newItem);
      }

      if (state.viewer.modularHeaders.length) {
        const modularHeaders = state.viewer.modularHeaders;
        modularHeaders.forEach((header, index, modularHeaders) => {
          if (header.dataElement === this.dataElement) {
            modularHeaders[index].items = this.items;
          }
        });
        store.dispatch(actions.updateModularHeaders(modularHeaders));
      }
    };

    setJustifyContent = (justifyContent) => {
      const validJustifications = Object.values(JUSTIFY_CONTENT);
      if (!validJustifications.includes(justifyContent)) {
        console.warn(`${justifyContent} is not a valid value for justifyContent. Please use one of the following: ${validJustifications}`);
        return;
      }
      store.dispatch(actions.setHeaderJustifyContent(this.dataElement, justifyContent));
    };

    setMaxWidth = (maxWidth) => {
      if (isNaN(maxWidth)) {
        console.warn(`${maxWidth} is not a valid value for maxWidth. Please use a number, which represents the maximum width of the header in pixels.`);
        return;
      }
      store.dispatch(actions.setHeaderMaxWidth(this.dataElement, maxWidth));
    };

    setMaxHeight = (maxHeight) => {
      if (isNaN(maxHeight)) {
        console.warn(`${maxHeight} is not a valid value for maxHeight. Please use a number, which represents the maximum height of the header in pixels.`);
        return;
      }
      store.dispatch(actions.setHeaderMaxHeight(this.dataElement, maxHeight));
    };
  }

  return new ModularHeader(props);
};
