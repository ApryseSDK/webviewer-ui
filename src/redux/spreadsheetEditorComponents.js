import DataElements from 'constants/dataElement';
import { ITEM_TYPE, CELL_ADJUSTMENT_BUTTONS, CELL_FORMAT_BUTTONS } from 'src/constants/customizationVariables';

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
      'editorDropDown'
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
  'sheet-tabs-bottom': {
    dataElement: 'sheet-tabs-bottom',
    placement: 'bottom',
    grow: 0,
    gap: 12,
    position: 'start',
    'float': false,
    stroke: true,
    style: {
      background: 'none',
      padding: 0
    },
    items: [
      'generic-file-tab',
    ]
  }
};

const formatButtonsConfigs = CELL_FORMAT_BUTTONS.reduce((acc, item) => {
  if (item === 'divider') {
    return acc;
  }
  const { label } = item;
  const key = label.charAt(0).toLowerCase() + label.slice(1);
  acc[key] = {
    dataElement: `format${label}`,
    type: 'presetButton',
    buttonType: `format${label}`,
  };
  return acc;
}, {});

const adjustmentButtonsConfig = CELL_ADJUSTMENT_BUTTONS.reduce((acc, item) => {
  if (item === 'divider') {
    return acc;
  }
  const key = item.charAt(0).toLowerCase() + item.slice(1);
  acc[key] = {
    dataElement: `adjustment${item}`,
    type: 'presetButton',
    buttonType: `adjustment${item}`,
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
  spreadsheetEditorModeDropdown: {
    dataElement: 'spreadsheetEditorModeDropdown',
    type: 'spreadsheetEditorModeDropdown',
    disabled: false,
  },
  editorDropDown: {
    dataElement: 'editorDropDown',
    items: [
      'spreadsheetEditorModeDropdown',
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

  'generic-file-tab': {
    dataElement: 'generic-file-tab',
    title: 'component.menuOverlay',
    type: 'genericFileTab',
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
    dataElement: ITEM_TYPE.SHEET_EDITOR_FILE_NAME,
    type: ITEM_TYPE.SHEET_EDITOR_FILE_NAME,
    readOnly: true,
  },

  spreadsheetEditorHomeGroupedItems: {
    dataElement: 'spreadsheetEditorHomeGroupedItems',
    items: [
      'cellCutButton',
      'cellCopyButton',
      'cellPasteButton',
      'divider-0.2',
      'divider-0.2.1',

      'boldButton',
      'italicButton',
      'underlineButton',

      'strikethroughButton',
      'divider-0.3',
      'cellTextColorButton',
      'cellBackgroundColorBtn',
      'divider-0.4',
      'cellTextAlignment',
      'divider-0.5',
      'cellAdjustment',
      'cellBorderStyleButton',
      'mergeToggleButton',
      'divider-0.6',
      'cellFormatAsCurrency',
      'cellFormatAsPercent',
      'cellFormatDecreaseDecimal',
      'cellFormatIncreaseDecimal',
      'cellFormatMore',
      'divider-0.7',
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
    buttonType: 'cellDecoratorBold'
  },
  italicButton: {
    dataElement: 'italicButton',
    type: 'presetButton',
    buttonType: 'cellDecoratorItalic'
  },
  underlineButton: {
    dataElement: 'underlineButton',
    type: 'presetButton',
    buttonType: 'cellDecoratorUnderline'
  },
  strikethroughButton: {
    dataElement: 'strikethroughButton',
    type: 'presetButton',
    buttonType: 'strikethroughButton',
  },



  cellTextColorButton: {
    dataElement: 'cellTextColorButton',
    type: 'presetButton',
    buttonType: 'cellTextColor',
  },
  cellBackgroundColorBtn: {
    dataElement: 'cellBackgroundColorBtn',
    type: 'presetButton',
    buttonType: 'cellBackgroundColor',
  },
  cellTextAlignment: {
    dataElement: 'cellTextAlignment',
    type: 'presetButton',
    buttonType: 'cellTextAlignment',
  },

  /** Cell Border Style */
  cellBorderStyleButton: {
    dataElement: 'cellBorderStyleButton',
    type: 'presetButton',
    buttonType: 'cellBorderStyle',
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
    buttonType: 'formatCurrency',
  },
  cellFormatAsPercent: {
    dataElement: 'cellFormatAsPercent',
    type: 'presetButton',
    buttonType: 'formatPercent',
  },
  cellFormatDecreaseDecimal: {
    dataElement: 'cellFormatDecreaseDecimal',
    type: 'presetButton',
    buttonType: 'formatDecreaseDecimal',
  },
  cellFormatIncreaseDecimal: {
    dataElement: 'cellFormatIncreaseDecimal',
    type: 'presetButton',
    buttonType: 'formatIncreaseDecimal',
  },
  cellFormatMore: {
    dataElement: 'formatMore',
    type: 'presetButton',
    buttonType: 'formatMore',
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
  cellAdjustment: {
    dataElement: 'cellAdjustment',
    type: 'presetButton',
    buttonType: 'cellAdjustment',
  },
  ...adjustmentButtonsConfig,

};


const defaultSpreadsheetEditorPanels = [
];


const adjustmentButtons = CELL_ADJUSTMENT_BUTTONS.map((item) => {
  if (item === 'divider') {
    return 'divider';
  }
  return {
    dataElement: `adjustment${item}`,
    type: 'presetButton',
    buttonType: `adjustment${item}`,
  };
});

const formatBUttons = CELL_FORMAT_BUTTONS.map((item) => {
  if (item === 'divider') {
    return 'divider';
  }
  return {
    dataElement: `format${item.label}`,
    type: 'presetButton',
    buttonType: `format${item.label}`,
    description: item.desc,
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
        'dataElement': 'cellTextAlignmentFlyout',
        'type': 'label',
        'label': 'sheetEditor.textAlignment',
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
        'type': 'presetButton',
      },
      {
        'dataElement': 'alignMiddleButton',
        'type': 'presetButton',
      },
      {
        'dataElement': 'alignBottomButton',
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
        'label': 'sheetEditor.cellAdjustment',
      },
      ...adjustmentButtons,
    ]
  },

  [DataElements.CELL_FORMAT_MORE_FLYOUT]: {
    'dataElement': DataElements.CELL_FORMAT_MORE_FLYOUT,
    'className': 'CellFormat',
    'items': [
      {
        'dataElement': 'cellFormatFlyout',
        'type': 'label',
        'label': 'sheetEditor.cellFormat',
      },
      ...formatBUttons,
    ]
  }
};


export { defaultSpreadsheetEditorHeaders, defaultSpreadsheetEditorComponents, defaultSpreadsheetEditorPanels, defaultSpreadsheetFlyoutMap };