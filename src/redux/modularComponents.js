/**
 * A namespace which contains APIs Modular UI components.
 * @namespace Components
 * @memberof UI
 * @example
 * webViewerInstance.UI.Components.someComponent
 * webViewerInstance.UI.Components.someAPI()
 */
import DataElements from 'constants/dataElement';
import { ITEM_TYPE, PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { panelNames } from 'constants/panel';

const defaultModularHeaders = {
  'default-top-header': {
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
      'default-ribbon-group',
      'comparePanelToggle',
      'searchPanelToggle',
      'notesPanelToggle',
    ]
  },
  'tools-header': {
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
      'annotateGroupedItems',
      'shapesGroupedItems',
      'insertGroupedItems',
      'redactionGroupedItems',
      'measureGroupedItems',
      'editGroupedItems',
      'contentEditGroupedItems',
      'fillAndSignGroupedItems',
      'formsGroupedItems'
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
const defaultModularComponents = {
  comparePanelToggle: {
    title: 'action.comparePages',
    label: 'action.comparePages',
    icon: 'icon-header-compare',
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.COMPARE,
  },
  filePickerButton: {
    title: 'action.openFile',
    label: 'action.openFile',
    icon: 'icon-header-file-picker-line',
    type: 'presetButton',
    buttonType: PRESET_BUTTON_TYPES.FILE_PICKER,
  },
  downloadButton: {
    title: 'action.download',
    label: 'action.download',
    icon: 'icon-download',
    type: 'presetButton',
    buttonType: PRESET_BUTTON_TYPES.DOWNLOAD,
  },
  saveAsButton: {
    title: 'saveModal.saveAs',
    label: 'saveModal.saveAs',
    icon: 'icon-save',
    type: 'presetButton',
    buttonType: PRESET_BUTTON_TYPES.SAVE_AS,
  },
  printButton: {
    title: 'action.print',
    label: 'action.print',
    icon: 'icon-header-print-line',
    type: 'presetButton',
    buttonType: PRESET_BUTTON_TYPES.PRINT,
  },
  createPortfolioButton: {
    title: 'portfolio.createPDFPortfolio',
    label: 'portfolio.createPDFPortfolio',
    icon: 'icon-pdf-portfolio',
    type: 'presetButton',
    buttonType: PRESET_BUTTON_TYPES.CREATE_PORTFOLIO,
  },
  settingsButton: {
    title: 'option.settings.settings',
    label: 'option.settings.settings',
    icon: 'icon-header-settings-line',
    type: 'presetButton',
    buttonType: PRESET_BUTTON_TYPES.SETTINGS,
  },
  'divider-0.1': {
    type: 'divider',
  },
  'leftPanelButton': {
    dataElement: DataElements.LEFT_PANEL_BUTTON,
    title: 'component.leftPanel',
    type: 'toggleButton',
    img: 'icon-header-sidebar-line',
    toggleElement: 'tabPanel',
  },
  'view-controls': {
    type: 'viewControls',
    title: 'component.viewControls',
    icon: 'icon-header-page-manipulation-line',
  },
  'divider-0.3': {
    type: 'divider',
  },
  'zoom-container': {
    type: 'zoom',
  },
  'divider-0.2': {
    type: 'divider',
  },
  panToolButton: {
    type: 'toolButton',
    toolName: 'Pan',
  },
  annotationEditToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationEdit',
  },
  'menuButton': {
    dataElement: DataElements.MENU_OVERLAY_BUTTON,
    img: 'ic-hamburger-menu',
    title: 'component.menuOverlay',
    toggleElement: 'MainMenuFlyout',
    type: 'toggleButton',
  },
  groupedLeftHeaderButtons: {
    items: [
      'menuButton',
      'divider-0.1',
      'leftPanelButton',
      'view-controls',
      'divider-0.3',
      'zoom-container',
      'divider-0.2',
      'panToolButton',
      'annotationEditToolButton',
    ],
    type: 'groupedItems',
    grow: 1,
    gap: 12,
    alwaysVisible: true,
    style: {},
  },
  'toolbarGroup-View': {
    title: 'View',
    type: 'ribbonItem',
    label: 'View',
    groupedItems: [],
    toolbarGroup: 'toolbarGroup-View',
  },
  'toolbarGroup-Annotate': {
    title: 'Annotate',
    type: 'ribbonItem',
    label: 'Annotate',
    groupedItems: ['annotateGroupedItems'],
    toolbarGroup: 'toolbarGroup-Annotate',
  },
  'toolbarGroup-Shapes': {
    title: 'Shapes',
    type: 'ribbonItem',
    label: 'Shapes',
    groupedItems: ['shapesGroupedItems'],
    toolbarGroup: 'toolbarGroup-Shapes',
  },
  'toolbarGroup-Insert': {
    title: 'Insert',
    type: 'ribbonItem',
    label: 'Insert',
    groupedItems: ['insertGroupedItems'],
    toolbarGroup: 'toolbarGroup-Insert',
  },
  'toolbarGroup-Measure': {
    title: 'Measure',
    type: 'ribbonItem',
    label: 'Measure',
    groupedItems: ['measureGroupedItems'],
    toolbarGroup: 'toolbarGroup-Measure',
  },
  'toolbarGroup-Redact': {
    title: 'Redact',
    type: 'ribbonItem',
    label: 'Redact',
    groupedItems: ['redactionGroupedItems'],
    toolbarGroup: 'toolbarGroup-Redact',
  },
  'toolbarGroup-Edit': {
    title: 'Edit',
    type: 'ribbonItem',
    label: 'Edit',
    groupedItems: ['editGroupedItems'],
    toolbarGroup: 'toolbarGroup-Edit',
  },
  'toolbarGroup-EditText': {
    title: 'Content Edit',
    type: 'ribbonItem',
    label: 'Content Edit',
    groupedItems: ['contentEditGroupedItems'],
    toolbarGroup: 'toolbarGroup-EditText',
  },
  'toolbarGroup-FillAndSign': {
    title: 'Fill and Sign',
    type: 'ribbonItem',
    label: 'Fill and Sign',
    groupedItems: ['fillAndSignGroupedItems'],
    toolbarGroup: 'toolbarGroup-FillAndSign',
  },
  'toolbarGroup-Forms': {
    title: 'Forms',
    type: 'ribbonItem',
    label: 'Forms',
    groupedItems: ['formsGroupedItems'],
    toolbarGroup: 'toolbarGroup-Forms',
  },
  'default-ribbon-group': {
    items: [
      'toolbarGroup-View',
      'toolbarGroup-Annotate',
      'toolbarGroup-Shapes',
      'toolbarGroup-Insert',
      'toolbarGroup-Measure',
      'toolbarGroup-Redact',
      'toolbarGroup-Edit',
      'toolbarGroup-EditText',
      'toolbarGroup-FillAndSign',
      'toolbarGroup-Forms',
    ],
    type: 'ribbonGroup',
    justifyContent: 'start',
    grow: 2,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  searchPanelToggle: {
    title: 'component.searchPanel',
    type: 'toggleButton',
    img: 'icon-header-search',
    toggleElement: 'searchPanel',
  },
  notesPanelToggle: {
    title: 'component.notesPanel',
    type: 'toggleButton',
    img: 'icon-header-chat-line',
    toggleElement: 'notesPanel',
  },
  highlightToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateTextHighlight',
  },
  underlineToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateTextUnderline',
  },
  strikeoutToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateTextStrikeout',
  },
  squigglyToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateTextSquiggly',
  },
  freeTextToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateFreeText',
  },
  markInsertTextToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateMarkInsertText',
  },
  markReplaceTextToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateMarkReplaceText',
  },
  freeHandToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateFreeHand',
  },
  freeHandHighlightToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateFreeHandHighlight',
  },
  stickyToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateSticky',
  },
  calloutToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateCallout',
  },
  'divider-0.4': {
    type: 'divider',
  },
  stylePanelToggle: {
    title: 'action.style',
    type: 'toggleButton',
    img: 'icon-style-panel-toggle',
    toggleElement: 'stylePanel',
  },
  indexPanelListToggle: {
    title: 'component.indexPanel',
    type: 'toggleButton',
    img: 'icon-index-panel-list',
    toggleElement: 'indexPanel',
  },
  'divider-0.5': {
    type: 'divider',
  },
  undoButton: {
    type: 'presetButton',
    buttonType: 'undoButton',
  },
  redoButton: {
    type: 'presetButton',
    buttonType: 'redoButton',
  },
  toggleAccessibilityModeButton: {
    dataElement: DataElements.TOGGLE_ACCESSIBILITY_MODE_PRESET_BUTTON,
    type: 'presetButton',
    buttonType: PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE,
  },
  eraserToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationEraserTool',
  },
  defaultAnnotationUtilities: {
    items: ['divider-0.5', 'undoButton', 'redoButton', 'eraserToolButton'],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  annotateToolsGroupedItems: {
    items: [
      'highlightToolButton',
      'underlineToolButton',
      'strikeoutToolButton',
      'squigglyToolButton',
      'freeHandToolButton',
      'freeHandHighlightToolButton',
      'freeTextToolButton',
      'markInsertTextToolButton',
      'markReplaceTextToolButton',
      'stickyToolButton',
      'calloutToolButton',
    ],
    type: 'groupedItems',
    justifyContent: 'center',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  annotateGroupedItems: {
    items: ['annotateToolsGroupedItems', 'divider-0.4', 'stylePanelToggle', 'defaultAnnotationUtilities'],
    type: 'groupedItems',
    justifyContent: 'center',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  rectangleToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateRectangle',
  },
  ellipseToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateEllipse',
  },
  arcToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateArc',
  },
  polygonToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreatePolygon',
  },
  cloudToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreatePolygonCloud',
  },
  lineToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateLine',
  },
  polylineToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreatePolyline',
  },
  arrowToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateArrow',
  },
  shapesToolsGroupedItems: {
    items: [
      'rectangleToolButton',
      'ellipseToolButton',
      'arcToolButton',
      'polygonToolButton',
      'cloudToolButton',
      'lineToolButton',
      'polylineToolButton',
      'arrowToolButton',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  shapesGroupedItems: {
    items: ['shapesToolsGroupedItems', 'divider-0.4', 'stylePanelToggle', 'defaultAnnotationUtilities'],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  rubberStampToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateRubberStamp',
  },
  signatureCreateToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateSignature',
  },
  fileAttachmentButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateFileAttachment',
  },
  stampToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateStamp',
  },
  insertToolsGroupedItems: {
    items: ['rubberStampToolButton', 'signatureCreateToolButton', 'fileAttachmentButton', 'stampToolButton'],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  insertGroupedItems: {
    items: ['insertToolsGroupedItems', 'divider-0.4', 'stylePanelToggle', 'defaultAnnotationUtilities'],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  redactionToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateRedaction',
  },
  pageRedactionToggleButton: {
    title: 'action.redactPages',
    type: 'toggleButton',
    img: 'icon-tool-page-redact',
    toggleElement: 'pageRedactionModal',
  },
  redactionPanelToggle: {
    type: 'toggleButton',
    img: 'icon-redact-panel',
    toggleElement: 'redactionPanel',
    title: 'component.redactionPanel',
  },
  redactionGroupedItems: {
    items: [
      'redactionToolButton',
      'pageRedactionToggleButton',
      'redactionPanelToggle',
      'divider-0.4',
      'stylePanelToggle',
      'defaultAnnotationUtilities',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  distanceMeasurementToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateDistanceMeasurement',
  },
  arcMeasurementToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateArcMeasurement',
  },
  perimeterMeasurementToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreatePerimeterMeasurement',
  },
  areaMeasurementToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateAreaMeasurement',
  },
  ellipseMeasurementToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateEllipseMeasurement',
  },
  rectangularAreaMeasurementToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateRectangularAreaMeasurement',
  },
  countMeasurementToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateCountMeasurement',
  },
  measureGroupedItems: {
    items: [
      'distanceMeasurementToolButton',
      'arcMeasurementToolButton',
      'perimeterMeasurementToolButton',
      'areaMeasurementToolButton',
      'ellipseMeasurementToolButton',
      'rectangularAreaMeasurementToolButton',
      'countMeasurementToolButton',
      'divider-0.4',
      'stylePanelToggle',
      'defaultAnnotationUtilities',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  cropToolButton: {
    type: 'toolButton',
    toolName: 'CropPage',
  },
  snippingToolButton: {
    type: 'toolButton',
    toolName: 'SnippingTool',
  },
  editGroupedItems: {
    items: ['cropToolButton', 'snippingToolButton'],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  addParagraphToolGroupButton: {
    type: 'toolButton',
    toolName: 'AddParagraphTool',
  },
  addImageContentToolGroupButton: {
    type: 'toolButton',
    toolName: 'AddImageContentTool',
  },
  'divider-0.6': {
    type: 'divider',
  },
  contentEditButton: {
    type: 'presetButton',
    buttonType: 'contentEditButton',
  },
  contentEditGroupedItems: {
    items: ['addParagraphToolGroupButton', 'addImageContentToolGroupButton', 'divider-0.6', 'contentEditButton'],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  crossStampToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateCrossStamp',
  },
  checkStampToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateCheckStamp',
  },
  dotStampToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateDotStamp',
  },
  calendarToolButton: {
    type: 'toolButton',
    toolName: 'AnnotationCreateDateFreeText',
  },
  fillAndSignGroupedItems: {
    items: [
      'signatureCreateToolButton',
      'freeTextToolButton',
      'crossStampToolButton',
      'checkStampToolButton',
      'dotStampToolButton',
      'rubberStampToolButton',
      'calendarToolButton',
      'divider-0.4',
      'stylePanelToggle',
      'defaultAnnotationUtilities',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  signatureFieldButton: {
    type: 'toolButton',
    toolName: 'SignatureFormFieldCreateTool',
  },
  textFieldButton: {
    type: 'toolButton',
    toolName: 'TextFormFieldCreateTool',
  },
  checkboxFieldButton: {
    type: 'toolButton',
    toolName: 'CheckBoxFormFieldCreateTool',
  },
  radioFieldButton: {
    type: 'toolButton',
    toolName: 'RadioButtonFormFieldCreateTool',
  },
  listBoxFieldButton: {
    type: 'toolButton',
    toolName: 'ListBoxFormFieldCreateTool',
  },
  comboBoxFieldButton: {
    type: 'toolButton',
    toolName: 'ComboBoxFormFieldCreateTool',
  },
  'divider-0.7': {
    type: 'divider',
  },
  formFieldEditButton: {
    type: 'presetButton',
    buttonType: 'formFieldEditButton',
  },
  'divider-0.8': {
    type: 'divider',
  },
  formsToolsGroupedItems: {
    items: [
      'signatureFieldButton',
      'textFieldButton',

      'freeTextToolButton',
      'checkboxFieldButton',
      'radioFieldButton',
      'listBoxFieldButton',
      'comboBoxFieldButton',
      'divider-0.7',
      'formFieldEditButton',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  formsGroupedItems: {
    items: ['formsToolsGroupedItems', 'divider-0.8', 'stylePanelToggle', 'indexPanelListToggle'],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  },
  'page-controls-container': {
    type: 'pageControls',
    title: 'component.pageControls',
    icon: 'icon-page-controls',
  },
  continuousPageTransitionButton: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.CONTINUOUS_PAGE_TRANSITION,
  },
  defaultPageTransitionButton: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.DEFAULT_PAGE_TRANSITION,
  },
  readerPageTransitionButton: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.READER_PAGE_TRANSITION,
  },
  rotateClockwiseButton: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.ROTATE_CLOCKWISE,
  },
  rotateCounterClockwiseButton: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.ROTATE_COUNTERCLOCKWISE,
  },
  singleLayoutButton: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.SINGLE_LAYOUT,
  },
  doubleLayoutButton: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.DOUBLE_LAYOUT,
  },
  coverLayoutButton: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.COVER_LAYOUT,
  },
  toggleCompareModeButton: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.TOGGLE_MULTI_VIEWER_MODE,
  },
  [DataElements.FULLSCREEN_BUTTON]: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.FULLSCREEN,
  },
  [PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE]: {
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE,
  }
};
const defaultPanels = [
  {
    dataElement: 'comparePanel',
    render: panelNames.CHANGE_LIST,
    location: 'end',
  },
  {
    dataElement: 'stylePanel',
    render: 'stylePanel',
    location: 'start'
  },
  {
    dataElement: 'thumbnailsPanel',
    render: 'thumbnailsPanel',
    location: 'start'
  },
  {
    dataElement: 'outlinesPanel',
    render: 'outlinesPanel',
    location: 'start'
  },
  {
    dataElement: 'bookmarksPanel',
    render: 'bookmarksPanel',
    location: 'start'
  },
  {
    dataElement: DataElements.FORM_FIELD_PANEL,
    render: 'formFieldPanel',
    location: 'end'
  },
  {
    dataElement: DataElements.INDEX_PANEL,
    render: 'indexPanel',
    location: 'end'
  },
  {
    dataElement: 'layersPanel',
    render: 'layersPanel',
    location: 'start'
  },
  {
    dataElement: 'signatureListPanel',
    render: 'signatureListPanel',
    location: 'start'
  },
  {
    dataElement: 'fileAttachmentPanel',
    render: 'fileAttachmentPanel',
    location: 'start'
  },
  {
    dataElement: 'rubberStampPanel',
    render: 'rubberStampPanel',
    location: 'start'
  },
  {
    dataElement: 'textEditingPanel',
    render: 'textEditingPanel',
    location: 'end'
  },
  {
    dataElement: 'signaturePanel',
    render: 'signaturePanel',
    location: 'start'
  },
  {
    dataElement: 'portfolioPanel',
    render: 'portfolioPanel',
    location: 'start'
  },
  {
    render: 'tabPanel',
    dataElement: 'tabPanel',
    panelsList: [
      {
        render: 'thumbnailsPanel'
      },
      {
        render: 'outlinesPanel'
      },
      {
        render: 'bookmarksPanel'
      },
      {
        render: 'layersPanel'
      },
      {
        render: 'signaturePanel'
      },
      {
        render: 'fileAttachmentPanel'
      },
      {
        render: 'portfolioPanel'
      }
    ],
    location: 'start'
  },
  {
    dataElement: 'notesPanel',
    render: 'notesPanel',
    location: 'end'
  },
  {
    dataElement: 'searchPanel',
    render: 'searchPanel',
    location: 'end'
  },
  {
    dataElement: 'redactionPanel',
    render: 'redactionPanel',
    location: 'end'
  }
];

const defaultFlyoutMap = {
  [DataElements.MAIN_MENU]: {
    dataElement: DataElements.MAIN_MENU,
    'items': [
      {
        'dataElement': 'newDocumentButton',
        'presetDataElement': 'newDocumentPresetButton',
        'icon': 'icon-plus-sign',
        'label': 'action.newDocument',
        'title': 'action.newDocument',
        'type': 'presetButton',
        'buttonType': 'newDocumentButton',
      },
      {
        'dataElement': 'filePickerButton',
        'presetDataElement': 'filePickerPresetButton',
        'icon': 'icon-header-file-picker-line',
        'label': 'action.openFile',
        'title': 'action.openFile',
        'type': 'presetButton',
        'buttonType': 'filePickerButton',
      },
      {
        'dataElement': 'downloadButton',
        'presetDataElement': 'downloadPresetButton',
        'icon': 'icon-download',
        'label': 'action.download',
        'title': 'action.download',
        'type': 'presetButton',
        'buttonType': 'downloadButton',
      },
      {
        'dataElement': 'fullscreenButton',
        'presetDataElement': 'fullscreenPresetButton',
        'icon': 'icon-header-full-screen',
        'label': 'action.enterFullscreen',
        'title': 'action.enterFullscreen',
        'type': 'presetButton',
        'buttonType': 'fullscreenButton',
      },
      {
        'dataElement': 'saveAsButton',
        'presetDataElement': 'saveAsPresetButton',
        'icon': 'icon-save',
        'label': 'saveModal.saveAs',
        'title': 'saveModal.saveAs',
        'type': 'presetButton',
        'buttonType': 'saveAsButton',
      },
      {
        'dataElement': 'printButton',
        'presetDataElement': 'printPresetButton',
        'icon': 'icon-header-print-line',
        'label': 'action.print',
        'title': 'action.print',
        'type': 'presetButton',
        'buttonType': 'printButton',
      },
      'divider',
      {
        'dataElement': DataElements.CREATE_PORTFOLIO_BUTTON,
        'presetDataElement': 'createPortfolioPresetButton',
        'icon': 'icon-pdf-portfolio',
        'label': 'portfolio.createPDFPortfolio',
        'title': 'portfolio.createPDFPortfolio',
        'type': 'presetButton',
        'buttonType': 'createPortfolioButton',
      },
      'divider',
      {
        'dataElement': 'settingsButton',
        'presetDataElement': 'settingsPresetButton',
        'icon': 'icon-header-settings-line',
        'label': 'option.settings.settings',
        'title': 'option.settings.settings',
        'type': 'presetButton',
        'buttonType': 'settingsButton',
      },
      'divider',
    ],
  },
  [DataElements.VIEW_CONTROLS_FLYOUT]: {
    dataElement: DataElements.VIEW_CONTROLS_FLYOUT,
    className: 'ViewControlsFlyout',
    items: [
      'option.displayMode.pageTransition',
      {
        dataElement: 'continuousPageTransitionButton',
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.CONTINUOUS_PAGE_TRANSITION,
      },
      {
        dataElement: 'defaultPageTransitionButton',
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.DEFAULT_PAGE_TRANSITION,
      },
      {
        dataElement: 'readerPageTransitionButton',
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.READER_PAGE_TRANSITION,
      },
      'divider',
      'action.rotate',
      {
        dataElement: 'rotateClockwiseButton',
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.ROTATE_CLOCKWISE,
      },
      {
        dataElement: 'rotateCounterClockwiseButton',
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.ROTATE_COUNTERCLOCKWISE,
      },
      'divider',
      'option.displayMode.layout',
      {
        dataElement: 'singleLayoutButton',
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.SINGLE_LAYOUT,
      },
      {
        dataElement: 'doubleLayoutButton',
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.DOUBLE_LAYOUT,
      },
      {
        dataElement: 'coverLayoutButton',
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.COVER_LAYOUT,
      },
      {
        dataElement: 'toggleCompareModeButton',
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.TOGGLE_MULTI_VIEWER_MODE,
      },
      'divider',
      {
        dataElement: DataElements.FULLSCREEN_BUTTON,
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.FULLSCREEN,
      },
      'divider',
      {
        dataElement: PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE,
        type: ITEM_TYPE.PRESET_BUTTON,
        buttonType: PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE,
      },
    ],
  },
};

const defaultPopups = {
  [DataElements.ANNOTATION_POPUP]: [
    { dataElement: DataElements.VIEW_FILE_BUTTON },
    { dataElement: DataElements.COMMENT_BUTTON },
    { dataElement: DataElements.STYLE_EDIT_BUTTON },
    { dataElement: DataElements.DATE_EDIT_BUTTON },
    { dataElement: DataElements.REDACT_BUTTON },
    { dataElement: DataElements.CROP_BUTTON },
    { dataElement: DataElements.CONTENT_EDIT_BUTTON },
    { dataElement: DataElements.CLEAR_SIGNATURE_BUTTON },
    { dataElement: DataElements.GROUP_BUTTON },
    { dataElement: DataElements.UNGROUP_BUTTON },
    { dataElement: DataElements.FORM_FIELD_EDIT_BUTTON },
    { dataElement: DataElements.CALIBRATION_POPUP_BUTTON },
    { dataElement: DataElements.LINK_BUTTON },
    { dataElement: DataElements.FILE_ATTACHMENT_DOWNLOAD },
    { dataElement: DataElements.ANNOTATION_DELETE_BUTTON },
    { dataElement: DataElements.SHORTCUT_KEYS_FOR_3D },
    { dataElement: DataElements.PLAY_SOUND_BUTTON },
    { dataElement: DataElements.OPEN_ALIGNMENT_BUTTON },
  ],
  [DataElements.TEXT_POPUP]: [
    { dataElement: DataElements.COPY_TEXT_BUTTON },
    { dataElement: DataElements.TEXT_HIGHLIGHT_TOOL_BUTTON },
    { dataElement: DataElements.TEXT_UNDERLINE_TOOL_BUTTON },
    { dataElement: DataElements.TEXT_SQUIGGLY_TOOL_BUTTON },
    { dataElement: DataElements.TEXT_STRIKEOUT_TOOL_BUTTON },
    { dataElement: DataElements.TEXT_REDACT_TOOL_BUTTON },
    { dataElement: DataElements.LINK_BUTTON },
  ],
  [DataElements.CONTEXT_MENU_POPUP]: [
    { dataElement: DataElements.PAN_TOOL_BUTTON },
    { dataElement: DataElements.STICKY_TOOL_BUTTON },
    { dataElement: DataElements.HIGHLIGHT_TOOL_BUTTON },
    { dataElement: DataElements.FREE_HAND_TOOL_BUTTON },
    { dataElement: DataElements.FREE_HAND_HIGHLIGHT_TOOL_BUTTON },
    { dataElement: DataElements.FREE_TEXT_TOOL_BUTTON },
    { dataElement: DataElements.MARK_INSERT_TEXT_TOOL_BUTTON },
    { dataElement: DataElements.MARK_REPLACE_TEXT_TOOL_BUTTON },
  ],
};

export { defaultModularComponents, defaultModularHeaders, defaultPanels, defaultFlyoutMap, defaultPopups };
