const PLACEMENT = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
};

const POSITION = {
  START: 'start',
  CENTER: 'center',
  END: 'end',
};

const JUSTIFY_CONTENT = {
  START: 'start',
  CENTER: 'center',
  END: 'end',
  SPACE_BETWEEN: 'space-between',
  SPACE_AROUND: 'space-around',
  SPACE_EVENLY: 'space-evenly',
};

const DIRECTION = {
  ROW: 'row',
  COLUMN: 'column',
};

const ITEM_TYPE = {
  BUTTON: 'customButton',
  STATEFUL_BUTTON: 'statefulButton',
  GROUPED_ITEMS: 'groupedItems',
  GROUPED_TOOLS: 'groupedTools',
  RIBBON_ITEM: 'ribbonItem',
  DIVIDER: 'divider',
  TOGGLE_BUTTON: 'toggleButton',
  RIBBON_GROUP: 'ribbonGroup',
  TOOL_GROUP_BUTTON: 'toolGroupButton',
  TOOL_BUTTON: 'toolButton',
  ZOOM: 'zoom',
  FLYOUT: 'flyout',
};

const RESPONSIVE_ITEMS = [
  ITEM_TYPE.GROUPED_ITEMS,
  ITEM_TYPE.GROUPED_TOOLS,
  ITEM_TYPE.RIBBON_GROUP,
  ITEM_TYPE.ZOOM,
];

const OPACITY_MODES = {
  STATIC: 'static',
  DYANMIC: 'dynamic',
};

const OPACITY_LEVELS = {
  FULL: 'full',
  LOW: 'low',
  NONE: 'none',
};

const DEFAULT_STYLES = {
  PADDING: 8,
  WIDTH: 1,
  BORDER_COLOR: 'var(--gray-5)',
  BORDER_STYLE: 'solid',
};

const DEFAULT_GAP = 12;

export {
  PLACEMENT,
  POSITION,
  JUSTIFY_CONTENT,
  DIRECTION,
  ITEM_TYPE,
  DEFAULT_GAP,
  OPACITY_LEVELS,
  OPACITY_MODES,
  RESPONSIVE_ITEMS,
  DEFAULT_STYLES,
};
