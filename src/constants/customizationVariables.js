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
  PAGE_CONTROLS: 'pageControls',
  PRESET_BUTTON: 'presetButton',
  VIEW_CONTROLS: 'viewControls',
  MENU: 'menu',
};

const RESPONSIVE_ITEMS = [
  ITEM_TYPE.GROUPED_ITEMS,
  ITEM_TYPE.GROUPED_TOOLS,
  ITEM_TYPE.RIBBON_GROUP,
  ITEM_TYPE.ZOOM,
  ITEM_TYPE.PAGE_CONTROLS,
];

const BUTTON_TYPES = [
  ITEM_TYPE.BUTTON,
  ITEM_TYPE.STATEFUL_BUTTON,
  ITEM_TYPE.TOGGLE_BUTTON,
  ITEM_TYPE.TOOL_GROUP_BUTTON,
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

const PRESET_BUTTON_TYPES = {
  UNDO: 'undoButton',
  REDO: 'redoButton',
  NEW_DOCUMENT: 'newDocumentButton',
  FILE_PICKER: 'filePickerButton',
  DOWNLOAD: 'downloadButton',
  FULLSCREEN: 'fullscreenButton',
  SAVE_AS: 'saveAsButton',
  PRINT: 'printButton',
  CREATE_PORTFOLIO: 'createPortfolioButton',
  SETTINGS: 'settingsButton',
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
  PRESET_BUTTON_TYPES,
  BUTTON_TYPES,
};
