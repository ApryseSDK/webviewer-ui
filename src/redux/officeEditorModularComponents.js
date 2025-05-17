import DataElements from 'constants/dataElement';
import { ITEM_TYPE, PRESET_BUTTON_TYPES } from 'constants/customizationVariables';

/**
 * A namespace which contains APIs Modular UI components.
 * @namespace Components
 * @memberof UI
 * @example
 * webViewerInstance.UI.Components.someComponent
 * webViewerInstance.UI.Components.someAPI()
 */

const defaultOfficeEditorModularHeaders = {
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
      'mainMenuAndZoom',
      'office-editor-default-ribbon-group',
      'editorModeAndSearch',
    ]
  },
  'tools-header': {
    dataElement: DataElements.OFFICE_EDITOR_TOOLS_HEADER,
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
      'officeEditorHomeGroupedItems',
      'officeEditorLayoutGroupedItems',
      'officeEditorInsertGroupedItems',
      // 'officeEditorReviewGroupedItems'
    ]
  },
  [DataElements.PAGE_NAV_FLOATING_HEADER]: {
    dataElement: DataElements.PAGE_NAV_FLOATING_HEADER,
    placement: 'bottom',
    grow: 0,
    gap: 12,
    position: 'center',
    opacityMode: 'dynamic',
    opacity: 'none',
    'float': true,
    stroke: true,
    dimension: {
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1
    },
    style: {
      background: 'var(--gray-1)',
      padding: '8px',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'var(--gray-5)'
    },
    items: [
      'page-controls-container'
    ]
  }
};

const defaultOfficeEditorModularComponents = {
  officeEditorFileName: {
    dataElement: DataElements.OFFICE_EDITOR_FILE_NAME,
    type: 'officeEditorFileName',
  },
  fontSizeDropdown: {
    dataElement: 'fontSizeDropdown',
    type: 'fontSizeDropdown',
  },
  fontFamilyDropdown: {
    dataElement: 'fontFamilyDropdown',
    type: 'fontFamilyDropdown',
  },
  stylePresetDropdown: {
    dataElement: 'stylePresetDropdown',
    type: 'stylePresetDropdown',
  },
  increaseIndentButton: {
    dataElement: 'increaseIndentButton',
    type: 'presetButton',
    buttonType: 'increaseIndentButton',
  },
  decreaseIndentButton: {
    dataElement: 'decreaseIndentButton',
    type: 'presetButton',
    buttonType: 'decreaseIndentButton',
  },
  toggleNonPrintingCharactersButton: {
    dataElement: PRESET_BUTTON_TYPES.OE_TOGGLE_NON_PRINTING_CHARACTERS,
    type: 'presetButton',
    buttonType: PRESET_BUTTON_TYPES.OE_TOGGLE_NON_PRINTING_CHARACTERS,
  },
  officeEditorMarginDropdown: {
    dataElement: DataElements.OFFICE_EDITOR_MARGIN_DROPDOWN,
    type: ITEM_TYPE.OFFICE_EDITOR_MARGIN_DROPDOWN,
    icon: 'icon-office-editor-margin',
    title: 'officeEditor.margins',
  },
  officeEditorBreakDropdown: {
    dataElement: DataElements.OFFICE_EDITOR_BREAK_DROPDOWN,
    type: ITEM_TYPE.OFFICE_EDITOR_BREAK_DROPDOWN,
    icon: 'icon-office-editor-page-break',
    title: 'officeEditor.breaks',
  },
  createTableDropdown: {
    dataElement: 'createTableDropdown',
    type: ITEM_TYPE.CREATE_TABLE_DROPDOWN,
    title: 'officeEditor.table',
    icon: 'ic-table',
  },
  officeEditorInsertImageButton: {
    dataElement: PRESET_BUTTON_TYPES.INSERT_IMAGE,
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.INSERT_IMAGE,
    icon: 'icon-tool-image-line',
    title: 'officeEditor.image',
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
  officeEditorModeDropdown: {
    dataElement: 'officeEditorModeDropdown',
    type: 'officeEditorModeDropdown',
  },
  lineSpacingButton: {
    dataElement: 'lineSpacingButton',
    type: 'lineSpacingButton',
  },
  orderedListButton: {
    dataElement: 'orderedListButton',
    type: 'orderedListButton',
  },
  unorderedListButton: {
    dataElement: 'unorderedListButton',
    type: 'unorderedListButton',
  },
  alignLeftButton: {
    dataElement: 'alignLeftButton',
    type: 'presetButton',
    buttonType: 'alignLeftButton'
  },
  alignCenterButton: {
    dataElement: 'alignCenterButton',
    type: 'presetButton',
    buttonType: 'alignCenterButton'
  },
  alignRightButton: {
    dataElement: 'alignRightButton',
    type: 'presetButton',
    buttonType: 'alignRightButton'
  },
  justifyBothButton: {
    dataElement: 'justifyBothButton',
    type: 'presetButton',
    buttonType: 'justifyBothButton'
  },
  officeEditorColorPicker: {
    dataElement: DataElements.OFFICE_EDITOR_FLYOUT_COLOR_PICKER,
    type: 'presetButton',
    buttonType: DataElements.OFFICE_EDITOR_FLYOUT_COLOR_PICKER,
  },
  undoButton: {
    dataElement: 'undoButton',
    type: 'presetButton',
    buttonType: 'undoButton'
  },
  redoButton: {
    dataElement: 'redoButton',
    type: 'presetButton',
    buttonType: 'redoButton'
  },
  undefined: {},
  'divider-0.1': {
    dataElement: 'divider-0.1',
    type: 'divider'
  },
  'divider-0.2': {
    dataElement: 'divider-0.2',
    type: 'divider'
  },
  'leftPanelButton': {
    dataElement: DataElements.LEFT_PANEL_BUTTON,
    title: 'Left Panel',
    type: 'toggleButton',
    img: 'icon-header-sidebar-line',
    toggleElement: 'tabPanel'
  },
  'view-controls': {
    dataElement: 'view-controls',
    type: 'viewControls'
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
  'zoom-container': {
    dataElement: 'zoom-container',
    type: 'zoom'
  },
  'divider-0.8': {
    dataElement: 'divider-0.8',
    type: 'divider'
  },
  'divider-0.9': {
    dataElement: 'divider-0.9',
    type: 'divider'
  },
  'divider-1.0': {
    dataElement: 'divider-1.0',
    type: 'divider'
  },
  'menuButton': {
    dataElement: DataElements.MENU_OVERLAY_BUTTON,
    img: 'ic-hamburger-menu',
    title: 'component.menuOverlay',
    toggleElement: 'MainMenuFlyout',
    type: 'toggleButton',
  },
  mainMenuAndZoom: {
    dataElement: 'mainMenuAndZoom',
    items: [
      'menuButton',
      'divider-0.1',
      'zoom-container',
      'divider-0.2',
      'officeEditorFileName',
    ],
    type: 'groupedItems',
    grow: 1,
    gap: 12,
    alwaysVisible: true,
    style: {}
  },
  editorModeAndSearch: {
    dataElement: 'editorModeAndSearch',
    items: [
      'officeEditorModeDropdown',
      'divider-0.3',
      'searchPanelToggle',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: true,
    style: {}
  },
  'toolbarGroup-oe-Home': {
    dataElement: 'toolbarGroup-oe-Home',
    title: 'Home',
    type: 'ribbonItem',
    label: 'Home',
    toolbarGroup: 'toolbarGroup-oe-Home',
    groupedItems: [
      'officeEditorHomeGroupedItems',
    ],
  },
  'toolbarGroup-oe-Layout': {
    dataElement: 'toolbarGroup-oe-Layout',
    title: 'Layout',
    type: 'ribbonItem',
    label: 'Layout',
    toolbarGroup: 'toolbarGroup-oe-Layout',
    groupedItems: [
      'officeEditorLayoutGroupedItems',
    ],
  },
  'toolbarGroup-oe-Insert': {
    dataElement: 'toolbarGroup-oe-Insert',
    title: 'Insert',
    type: 'ribbonItem',
    label: 'Insert',
    toolbarGroup: 'toolbarGroup-oe-Insert',
    groupedItems: [
      'officeEditorInsertGroupedItems',
    ],
  },
  'toolbarGroup-oe-Review': {
    dataElement: 'toolbarGroup-oe-Review',
    title: 'Review',
    type: 'ribbonItem',
    label: 'Review',
    toolbarGroup: 'toolbarGroup-oe-Review',
    groupedItems: [
      'officeEditorReviewGroupedItems',
    ],
  },
  'office-editor-default-ribbon-group': {
    dataElement: 'office-editor-default-ribbon-group',
    items: [
      'toolbarGroup-oe-Home',
      'toolbarGroup-oe-Layout',
      'toolbarGroup-oe-Insert',
      // 'toolbarGroup-oe-Review',
    ],
    type: 'ribbonGroup',
    justifyContent: 'start',
    grow: 2,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  searchPanelToggle: {
    dataElement: 'searchPanelToggle',
    title: 'component.searchPanel',
    type: 'toggleButton',
    img: 'icon-header-search',
    toggleElement: 'searchPanel'
  },
  officeEditorHomeGroupedItems: {
    dataElement: 'officeEditorHomeGroupedItems',
    items: [
      'stylePresetDropdown',
      'fontFamilyDropdown',
      'fontSizeDropdown',
      'divider-0.2',
      'boldButton',
      'italicButton',
      'underlineButton',
      'divider-0.3',
      'officeEditorColorPicker',
      'divider-0.4',
      'lineSpacingButton',
      'divider-0.5',
      'unorderedListButton',
      'orderedListButton',
      'divider-0.6',
      'alignLeftButton',
      'alignCenterButton',
      'alignRightButton',
      'justifyBothButton',
      'divider-0.7',
      'decreaseIndentButton',
      'increaseIndentButton',
      'toggleNonPrintingCharactersButton',
      'divider-0.8',
      'undoButton',
      'redoButton',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  officeEditorLayoutGroupedItems: {
    dataElement: 'officeEditorLayoutGroupedItems',
    items: [
      ITEM_TYPE.OFFICE_EDITOR_MARGIN_DROPDOWN,
      'divider-1.0',
      'undoButton',
      'redoButton',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  officeEditorInsertGroupedItems: {
    dataElement: 'officeEditorInsertGroupedItems',
    items: [
      ITEM_TYPE.OFFICE_EDITOR_BREAK_DROPDOWN,
      'divider-0.9',
      'createTableDropdown',
      ITEM_TYPE.OFFICE_EDITOR_INSERT_IMAGE_BUTTON,
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  officeEditorReviewToolsGroupedItems: {
    dataElement: 'officeEditorReviewToolsGroupedItems',
    items: [
      'searchPanelToggle',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  officeEditorReviewGroupedItems: {
    dataElement: 'officeEditorReviewGroupedItems',
    items: [
      'officeEditorReviewToolsGroupedItems',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  'page-controls-container': {
    dataElement: 'page-controls-container',
    type: 'pageControls'
  }
};
const defaultOfficeEditorPanels = [
  {
    dataElement: DataElements.OFFICE_EDITOR_REVIEW_PANEL,
    render: 'notesPanel',
    location: 'left'
  },
  {
    dataElement: 'searchPanel',
    render: 'searchPanel',
    location: 'right'
  },
];

export { defaultOfficeEditorModularHeaders, defaultOfficeEditorModularComponents, defaultOfficeEditorPanels };