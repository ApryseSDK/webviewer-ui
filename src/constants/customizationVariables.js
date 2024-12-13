import DataElements from 'constants/dataElement';

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
  TOOL_BUTTON: 'toolButton',
  ZOOM: 'zoom',
  FLYOUT: 'flyout',
  PAGE_CONTROLS: 'pageControls',
  PRESET_BUTTON: 'presetButton',
  VIEW_CONTROLS: 'viewControls',
  TABS_PANEL: 'tabPanel',
  OFFICE_EDITOR_FILE_NAME: 'officeEditorFileName',
  FONT_SIZE_DROPDOWN: 'fontSizeDropdown',
  FONT_FACE_DROPDOWN: 'fontFaceDropdown',
  STYLE_PRESET_DROPDOWN: 'stylePresetDropdown',
  PAGE_NAVIGATION_BUTTON: 'pageNavigationButton',
  CREATE_TABLE_DROPDOWN: 'createTableDropdown',
  OFFICE_EDITOR_INSERT_IMAGE_BUTTON: 'officeEditorInsertImageButton',
  OFFICE_EDITOR_PAGE_BREAK_BUTTON: 'officeEditorPageBreakButton',
  OFFICE_EDITOR_MODE_DROPDOWN: 'officeEditorModeDropdown',
  OFFICE_EDITOR_TOGGLE_NON_PRINTING_CHARACTERS_BUTTON: 'officeEditorToggleNonPrintingCharactersButton',
  LINE_SPACING_BUTTON: 'lineSpacingButton',
  ORDERED_LIST: 'orderedListButton',
  UNORDERED_LIST: 'unorderedListButton',
};

const FLYOUT_ITEM_TYPES = {
  BUTTON: 'button',
  PRESET_BUTTON: 'presetButton',
  RIBBON_ITEM: 'ribbonItem',
  TOOL_BUTTON: 'toolButton',
  TOGGLE_BUTTON: 'toggleButton',
  ZOOM_OPTIONS_BUTTON: 'zoomOptionsButton',
  ZOOM_BUTTON: 'zoomButton',
  PAGE_NAVIGATION_INPUT: 'pageNavigationInput',
  UNDO_BUTTON: 'undoButton',
  REDO_BUTTON: 'redoButton',
  TAB_PANEL_ITEM: 'tabPanelItem',
  LABEL: 'label',
  DIVIDER: 'divider',
  LINE_SPACING_OPTIONS_BUTTON: 'lineHeightButton',
  LIST_TYPE_BUTTON: 'listTypeButton',
  FONT_SIZE_DROPDOWN: 'fontSizeDropdown',
  FONT_FACE_DROPDOWN: 'fontFaceDropdown',
  STYLE_PRESET_DROPDOWN: 'stylePresetDropdown',
  OFFICE_EDITOR_MODE_DROPDOWN: 'officeEditorModeDropdown',
};

const PREBUILT_FLYOUTS = [
  'ViewControlsFlyout',
  'ZoomFlyoutMenu',
  'pageControlsFlyout',
  'NoteStateFlyout',
  'MoreOptionsContextMenuFlyout',
  DataElements.PAGE_MANIPULATION,
  'NotePopupFlyout',
  DataElements.PAGE_MANIPULATION_FLYOUT_MULTI_SELECT,
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
 * @property {string} INCREASE_INDENT {@link UI.Components.PresetButton.increaseIndentButton}
 * @property {string} DECREASE_INDENT {@link UI.Components.PresetButton.decreaseIndentButton}
 * @property {string} BOLD {@link UI.Components.PresetButton.boldButton}
 * @property {string} ITALIC {@link UI.Components.PresetButton.italicButton}
 * @property {string} UNDERLINE {@link UI.Components.PresetButton.underlineButton}
 * @property {string} JUSTIFY_LEFT {@link UI.Components.PresetButton.justifyLeftButton}
 * @property {string} JUSTIFY_CENTER {@link UI.Components.PresetButton.justifyCenterButton}
 * @property {string} JUSTIFY_RIGHT {@link UI.Components.PresetButton.justifyRightButton}
 * @property {string} JUSTIFY_BOTH {@link UI.Components.PresetButton.justifyBothButton}
 * @property {string} OE_COLOR_PICKER {@link UI.Components.PresetButton.officeEditorColorPicker}
 * @property {string} INSERT_IMAGE {@link UI.Components.PresetButton.insertImageButton}
 * @property {string} PAGE_BREAK {@link UI.Components.PresetButton.pageBreakButton}
 * @property {string} OFFICE_EDITOR_TOGGLE_NON_PRINTING_CHARACTERS_BUTTON {@link UI.Components.PresetButton.officeEditorToggleNonPrintingCharactersButton}
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
  RENAME: 'renameButton',
  INCREASE_INDENT: 'increaseIndentButton',
  DECREASE_INDENT: 'decreaseIndentButton',
  BOLD: 'boldButton',
  ITALIC: 'italicButton',
  UNDERLINE: 'underlineButton',
  JUSTIFY_LEFT: 'justifyLeftButton',
  JUSTIFY_CENTER: 'justifyCenterButton',
  JUSTIFY_RIGHT: 'justifyRightButton',
  JUSTIFY_BOTH: 'justifyBothButton',
  OE_COLOR_PICKER: 'officeEditorColorPicker',
  OE_TOGGLE_NON_PRINTING_CHARACTERS: 'officeEditorToggleNonPrintingCharactersButton',
  INSERT_IMAGE: 'insertImageButton',
  COMPARE: 'compareButton',
  PAGE_BREAK: 'pageBreakButton',
  EDITOR_MODE: 'editorModeButton',
};

const PRESET_BUTTONS_MODAL_TOGGLES = [
  PRESET_BUTTON_TYPES.PRINT,
  PRESET_BUTTON_TYPES.SAVE_AS,
  PRESET_BUTTON_TYPES.CREATE_PORTFOLIO,
  PRESET_BUTTON_TYPES.SETTINGS,
];

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
  FLYOUT_ITEM_TYPES,
  PRESET_BUTTONS_MODAL_TOGGLES,
};
