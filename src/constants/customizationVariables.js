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
  MODULAR_HEADER: 'modularHeader',
  BUTTON: 'customButton',
  STATEFUL_BUTTON: 'statefulButton',
  GROUPED_ITEMS: 'groupedItems',
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
  TABS_PANEL: 'tabPanel',
};

const PREBUILT_FLYOUTS = [
  'ViewControlsFlyout',
  'ZoomFlyoutMenu',
  'pageNavFlyoutMenu',
];

const OVERFLOW_FLYOUTS = [
  'GroupedItemsFlyout',
  'RibbonOverflowFlyout',
  'RibbonGroupFlyout',
  'tabPanelOverflowFlyout',
];

const RESPONSIVE_ITEMS = [
  ITEM_TYPE.GROUPED_ITEMS,
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

/**
 * Contains string enums for preset button types.
 * @name UI.PRESET_BUTTON_TYPES
 * @property {string} UNDO {@link UI.Components.PresetButton.undoButton}
 * @property {string} REDO {@link UI.Components.PresetButton.redoButton}
 * @property {string} NEW_DOCUMENT {@link UI.Components.PresetButton.newDocumentButton}
 * @property {string} FILE_PICKER {@link UI.Components.PresetButton.filePickerButton}
 * @property {string} DOWNLOAD {@link UI.Components.PresetButton.downloadButton}
 * @property {string} FULLSCREEN {@link UI.Components.PresetButton.fullscreenButton}
 * @property {string} SAVE_AS {@link UI.Components.PresetButton.saveAsButton}
 * @property {string} PRINT {@link UI.Components.PresetButton.printButton}
 * @property {string} CREATE_PORTFOLIO {@link UI.Components.PresetButton.createPortfolioButton}
 * @property {string} SETTINGS {@link UI.Components.PresetButton.settingsButton}
 * @property {string} FORM_FIELD_EDIT {@link UI.Components.PresetButton.formFieldEditButton}
 * @property {string} CONTENT_EDIT {@link UI.Components.PresetButton.contentEditButton}
 * @example
 * const undoButton = new UI.Components.PresetButton({ buttonType: UI.PRESET_BUTTON_TYPES.UNDO });
 */
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
  FORM_FIELD_EDIT: 'formFieldEditButton',
  CONTENT_EDIT: 'contentEditButton',
};

const DEFAULT_GAP = 12;

export {
  PLACEMENT,
  POSITION,
  JUSTIFY_CONTENT,
  DIRECTION,
  ITEM_TYPE,
  PREBUILT_FLYOUTS,
  OVERFLOW_FLYOUTS,
  DEFAULT_GAP,
  OPACITY_LEVELS,
  OPACITY_MODES,
  RESPONSIVE_ITEMS,
  DEFAULT_STYLES,
  PRESET_BUTTON_TYPES,
  BUTTON_TYPES,
};
