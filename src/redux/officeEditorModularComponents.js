import DataElements from 'constants/dataElement';

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
      'groupedLeftHeaderButtons',
      'office-editor-default-ribbon-group',
      'officeEditorModeDropdown',
      'divider-0.3',
      'searchPanelToggle',
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
      'officeEditorInsertGroupedItems',
      // 'officeEditorReviewGroupedItems'
    ]
  },
  'page-nav-floating-header': {
    dataElement: 'page-nav-floating-header',
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
  fontSizeDropdown: {
    dataElement: 'fontSizeDropdown',
    type: 'fontSizeDropdown',
  },
  fontFaceDropdown: {
    dataElement: 'fontFaceDropdown',
    type: 'fontFaceDropdown',
  },
  stylePresetDropdown: {
    dataElement: 'stylePresetDropdown',
    type: 'stylePresetDropdown',
  },
  createTableDropdown: {
    dataElement: 'createTableDropdown',
    type: 'createTableDropdown',
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
  orderedListButton: {
    dataElement: 'orderedListButton',
    type: 'presetButton',
    buttonType: 'orderedListButton',
  },
  unorderedListButton: {
    dataElement: 'unorderedListButton',
    type: 'presetButton',
    buttonType: 'unorderedListButton',
  },
  undefined: {},
  'divider-0.1': {
    dataElement: 'divider-0.1',
    type: 'divider'
  },
  'left-panel-toggle': {
    dataElement: 'left-panel-toggle',
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
  'zoom-container': {
    dataElement: 'zoom-container',
    type: 'zoom'
  },
  'divider-0.2': {
    dataElement: 'divider-0.2',
    type: 'divider'
  },
  'menu-toggle-button': {
    dataElement: 'menu-toggle-button',
    img: 'ic-hamburger-menu',
    title: 'component.menuOverlay',
    toggleElement: 'MainMenuFlyout',
    type: 'toggleButton',
  },
  groupedLeftHeaderButtons: {
    dataElement: 'groupedLeftHeaderButtons',
    items: [
      'menu-toggle-button',
      'divider-0.1',
      'zoom-container',
      'divider-0.2',
      // add document name component here, https://apryse.atlassian.net/browse/WVR-6323
    ],
    type: 'groupedItems',
    grow: 1,
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
  officeEditorHomeToolsGroupedItems: {
    dataElement: 'officeEditorHomeToolsGroupedItems',
    items: [
      'stylePresetDropdown',
      'fontFaceDropdown',
      'fontSizeDropdown',
      'divider-0.2',
      'boldButton',
      'italicButton',
      'underlineButton',
      'divider-0.3',
      'unorderedListButton',
      'orderedListButton',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  officeEditorHomeGroupedItems: {
    dataElement: 'officeEditorHomeGroupedItems',
    items: [
      'officeEditorHomeToolsGroupedItems',
      'divider-0.4',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  officeEditorInsertToolsGroupedItems: {
    dataElement: 'officeEditorInsertToolsGroupedItems',
    items: [
      'createTableDropdown',
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
      'officeEditorInsertToolsGroupedItems',
      'divider-0.4',
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
      'divider-0.4',
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
    dataElement: DataElements.LEFT_PANEL,
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