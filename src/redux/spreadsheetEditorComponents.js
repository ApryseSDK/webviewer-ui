import DataElements from 'constants/dataElement';
import { ITEM_TYPE, CELL_ADJUSTMENT_FLYOUT_ITEMS, CELL_FORMAT_BUTTONS } from 'src/constants/customizationVariables';

const defaultSpreadsheetEditorHeaders = {
  'default-top-header': {
    dataElement: 'default-top-header',
    placement: 'top',
    grow: 0,
    gap: 12,
    position: 'start',
    'float': false,
    stroke: true,
    dimension: {
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1
    },
    style: {},
    items: [
      'groupedLeftHeaderButtons',
      'editorDropdown'
    ]
  },
  'tools-header': {
    dataElement: DataElements.SPREADSHEET_EDITOR_TOOLS_HEADER,
    placement: 'top',
    justifyContent: 'center',
    grow: 0,
    gap: 12,
    position: 'end',
    'float': false,
    stroke: true,
    dimension: {
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1
    },
    style: {},
    items: [
      'spreadsheetEditorHomeGroupedItems',
    ]
  },
};

const formatButtonsConfigs = CELL_FORMAT_BUTTONS.reduce((acc, item) => {
  if (item === 'divider') {
    return acc;
  }
  const { label } = item;
  acc[label] = {
    dataElement: label,
    type: 'presetButton',
    buttonType: label,
  };
  return acc;
}, {});

const adjustmentButtonsConfig = CELL_ADJUSTMENT_FLYOUT_ITEMS.reduce((acc, item) => {
  if (item === 'divider') {
    return acc;
  }
  acc[item] = {
    dataElement: item,
    type: 'presetButton',
    buttonType: item,
  };
  return acc;
}, {});

const defaultSpreadsheetEditorComponents = {
  'menuButton': {
    dataElement: DataElements.MENU_OVERLAY_BUTTON,
    img: 'ic-hamburger-menu',
    title: 'component.menuOverlay',
    toggleElement: 'MainMenuFlyout',
    type: 'toggleButton',
  },
  spreadsheetEditorEditModeDropdown: {
    dataElement: 'spreadsheetEditorEditModeDropdown',
    type: 'spreadsheetEditorEditModeDropdown',
    disabled: true,
  },
  editorDropdown: {
    dataElement: 'editorDropdown',
    items: [
      'spreadsheetEditorEditModeDropdown',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: true,
    style: {}
  },
  'groupedLeftHeaderButtons': {
    dataElement: 'groupedLeftHeaderButtons',
    items: [
      'menuButton',
      'divider-0.1',
      'zoom-container',
      'divider-0.1.1',
      'spreadsheetEditorFileName',
    ],
    type: 'groupedItems',
    grow: 1,
    gap: 12,
    alwaysVisible: true,
    style: {}
  },

  'zoom-container': {
    dataElement: 'zoom-container',
    type: 'zoom'
  },
  'divider-0.1': {
    dataElement: 'divider-0.1',
    type: 'divider'
  },
  'divider-0.1.1': {
    dataElement: 'divider-0.1.1',
    type: 'divider'
  },
  'spreadsheetEditorFileName': {
    dataElement: ITEM_TYPE.SPREADSHEET_EDITOR_FILE_NAME,
    type: ITEM_TYPE.SPREADSHEET_EDITOR_FILE_NAME,
    readOnly: true,
  },

  spreadsheetEditorHomeGroupedItems: {
    dataElement: 'spreadsheetEditorHomeGroupedItems',
    items: [
      'cellCutButton',
      'cellCopyButton',
      'cellPasteButton',
      'divider-0.2',
      'fontFamilyDropdown',
      'fontSizeDropdown',
      'divider-0.3',
      'boldButton',
      'italicButton',
      'underlineButton',
      'strikeoutButton',
      'divider-0.4',
      'cellTextColorElement',
      'cellBackgroundColorElement',
      'divider-0.5',
      'textAlignmentToggleButton',
      'divider-0.6',
      'cellAdjustmentButton',
      'borderStyleToggleButton',
      'cellBorderColorElement',
      'mergeToggleButton',
      'divider-0.7',
      'cellFormatAsCurrency',
      'cellFormatAsPercent',
      'cellFormatDecreaseDecimal',
      'cellFormatIncreaseDecimal',
      'cellFormatMoreToggleButton',
      'divider-0.8',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: true,
    style: {}
  },
  'divider-0.2': {
    dataElement: 'divider-0.2',
    type: 'divider'
  },
  'divider-0.2.1': {
    dataElement: 'divider-0.2.1',
    type: 'divider'
  },
  'divider-0.3': {
    dataElement: 'divider-0.3',
    type: 'divider'
  },
  'divider-0.4': {
    dataElement: 'divider-0.4',
    type: 'divider'
  },
  'divider-0.5': {
    dataElement: 'divider-0.5',
    type: 'divider'
  },
  'divider-0.6': {
    dataElement: 'divider-0.6',
    type: 'divider'
  },
  'divider-0.7': {
    dataElement: 'divider-0.7',
    type: 'divider'
  },
  'divider-0.8': {
    dataElement: 'divider-0.8',
    type: 'divider'
  },
  cellCutButton: {
    dataElement: 'cellCutButton',
    type: 'presetButton',
    buttonType: 'cellCut'
  },
  cellCopyButton: {
    dataElement: 'cellCopyButton',
    type: 'presetButton',
    buttonType: 'cellCopy'
  },
  cellPasteButton: {
    dataElement: 'cellPasteButton',
    type: 'presetButton',
    buttonType: 'cellPaste'
  },

  boldButton: {
    dataElement: 'boldButton',
    type: 'presetButton',
    buttonType: 'boldButton'
  },
  italicButton: {
    dataElement: 'italicButton',
    type: 'presetButton',
    buttonType: 'italicButton'
  },
  underlineButton: {
    dataElement: 'underlineButton',
    type: 'presetButton',
    buttonType: 'underlineButton'
  },
  strikeoutButton: {
    dataElement: 'strikeoutButton',
    type: 'presetButton',
    buttonType: 'strikeoutButton',
  },
  cellTextColorElement: {
    dataElement: 'cellTextColorElement',
    type: 'cellTextColor',
  },
  cellBackgroundColorElement: {
    dataElement: 'cellBackgroundColorElement',
    type: 'cellBackgroundColor',
  },
  textAlignmentToggleButton: {
    dataElement: 'textAlignmentToggleButton',
    img: 'icon-menu-left-align',
    title: 'spreadsheetEditor.textAlignment',
    toggleElement: DataElements.CELL_TEXT_ALIGNMENT_FLYOUT,
    type: 'toggleButton',
  },

  /** Cell Border Style */
  borderStyleToggleButton: {
    dataElement: 'borderStyleToggleButton',
    img: 'ic-border-main',
    title: 'spreadsheetEditor.cellBorderStyle',
    toggleElement: DataElements.CELL_BORDER_FLYOUT,
    type: 'toggleButton',
  },
  cellBorderColorElement: {
    dataElement: 'cellBorderColorElement',
    type: 'cellBorderColor',
  },

  mergeToggleButton: {
    dataElement: 'mergeToggleButton',
    type: 'presetButton',
    buttonType: 'cellMergeToggle',
  },

  // Cell Formats
  cellFormatAsCurrency: {
    dataElement: 'formatAsCurrency',
    type: 'presetButton',
    buttonType: 'currencyFormat',
  },
  cellFormatAsPercent: {
    dataElement: 'cellFormatAsPercent',
    type: 'presetButton',
    buttonType: 'percentFormat',
  },
  cellFormatDecreaseDecimal: {
    dataElement: 'cellFormatDecreaseDecimal',
    type: 'presetButton',
    buttonType: 'decreaseDecimalFormat',
  },
  cellFormatIncreaseDecimal: {
    dataElement: 'cellFormatIncreaseDecimal',
    type: 'presetButton',
    buttonType: 'increaseDecimalFormat',
  },
  cellFormatMoreToggleButton: {
    dataElement: 'cellFormatMoreToggleButton',
    type: 'toggleButton',
    img: 'icon-tools-more',
    title: 'spreadsheetEditor.cellFormatMoreOptions',
    toggleElement: DataElements.CELL_FORMAT_MORE_FLYOUT,
  },
  ...formatButtonsConfigs,

  alignTopButton: {
    dataElement: 'alignTopButton',
    type: 'presetButton',
    buttonType: 'alignTopButton'
  },
  alignMiddleButton: {
    dataElement: 'alignMiddleButton',
    type: 'presetButton',
    buttonType: 'alignMiddleButton'
  },
  alignBottomButton: {
    dataElement: 'alignBottomButton',
    type: 'presetButton',
    buttonType: 'alignBottomButton'
  },

  /** Cell Adjustment */
  cellAdjustmentButton: {
    dataElement: 'cellAdjustmentButton',
    img: 'ic-insert-column',
    title: 'spreadsheetEditor.cellAdjustment',
    toggleElement: DataElements.CELL_ADJUSTMENT_FLYOUT,
    type: 'toggleButton',
  },
  ...adjustmentButtonsConfig,

  fontSizeDropdown: {
    dataElement: 'fontSizeDropdown',
    type: 'fontSizeDropdown',
  },
  fontFamilyDropdown: {
    dataElement: 'fontFamilyDropdown',
    type: 'fontFamilyDropdown',
  },
};

const defaultSpreadsheetEditorPanels = [
];

const adjustmentButtons = CELL_ADJUSTMENT_FLYOUT_ITEMS.map((item) => {
  if (item === 'divider') {
    return 'divider';
  }
  return {
    dataElement: item,
    type: 'presetButton',
    buttonType: item,
  };
});

const formatButtons = CELL_FORMAT_BUTTONS.map((item) => {
  if (item === 'divider') {
    return 'divider';
  }
  return {
    dataElement: item.label,
    type: 'presetButton',
    buttonType: item.label,
    secondaryLabel: item.desc,
  };
});

const defaultSpreadsheetFlyoutMap = {
  [DataElements.MAIN_MENU]: {
    dataElement: DataElements.MAIN_MENU,
    'items': [
      {
        'dataElement': 'mainMenuLabel',
        'type': 'label',
        'label': 'component.mainMenu',
      },
      {
        'dataElement': 'newSpreadsheetButton',
        'type': 'presetButton',
      },
      {
        'dataElement': 'filePickerButton',
        'type': 'presetButton',
      },
      {
        'dataElement': 'fullscreenButton',
        'type': 'presetButton',
      },
      {
        'dataElement': 'saveAsButton',
        'type': 'presetButton',
      },
      'divider',
      {
        'dataElement': 'settingsButton',
        'type': 'presetButton',
      },
    ]
  },

  [DataElements.CELL_TEXT_ALIGNMENT_FLYOUT]: {
    dataElement: DataElements.CELL_TEXT_ALIGNMENT_FLYOUT,
    'className': 'CellTextAlignment',
    'items': [
      {
        'dataElement': 'cellTextAlignmentFlyoutLabel',
        'type': 'label',
        'label': 'spreadsheetEditor.textAlignment',
      },
      {
        'dataElement': 'cellAlignLeft',
        'type': 'presetButton',
        'buttonType': 'alignLeftButton'
      },
      {
        'dataElement': 'cellAlignCenter',
        'type': 'presetButton',
        'buttonType': 'alignCenterButton'
      },
      {
        'dataElement': 'cellAlignRight',
        'type': 'presetButton',
        'buttonType': 'alignRightButton'
      },
      'divider',
      {
        'dataElement': 'alignTopButton',
        'buttonType': 'alignTopButton',
        'type': 'presetButton',
      },
      {
        'dataElement': 'alignMiddleButton',
        'buttonType': 'alignMiddleButton',
        'type': 'presetButton',
      },
      {
        'dataElement': 'alignBottomButton',
        'buttonType': 'alignBottomButton',
        'type': 'presetButton',
      },
    ]
  },

  [DataElements.CELL_ADJUSTMENT_FLYOUT]: {
    'dataElement': DataElements.CELL_ADJUSTMENT_FLYOUT,
    'className': 'CellAdjustment',
    'items': [
      {
        'dataElement': 'cellAdjustmentFlyout',
        'type': 'label',
        'label': 'spreadsheetEditor.cellAdjustment',
      },
      ...adjustmentButtons,
    ]
  },

  [DataElements.CELL_BORDER_FLYOUT]: {
    'dataElement': DataElements.CELL_BORDER_FLYOUT,
    'className': 'CellBorder',
    'items': [
      {
        'dataElement': 'cellBorderStyleFlyout',
        'type': 'label',
        'label': 'spreadsheetEditor.borders',
      },
      {
        'dataElement': 'cellBorderButtons',
        'type': 'cellBorders',
      },
      'divider',
      {
        'dataElement': 'cellBorderStyle',
        'type': 'label',
        'label': 'spreadsheetEditor.cellBorderStyle',
        'id': 'cellBorderStyleLabel',
      },
      {
        'type': 'cellBorderStyleDropdown',
        'labelledById': 'cellBorderStyleLabel',
      },
    ]
  },

  [DataElements.CELL_FORMAT_MORE_FLYOUT]: {
    'dataElement': DataElements.CELL_FORMAT_MORE_FLYOUT,
    'className': 'CellFormat',
    'items': [
      {
        'dataElement': 'cellFormatFlyout',
        'type': 'label',
        'label': 'spreadsheetEditor.cellFormat',
      },
      ...formatButtons,
    ]
  },
};


export {
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorPanels,
  defaultSpreadsheetFlyoutMap,
};