/**
 * A namespace which contains APIs Modular UI components.
 * @namespace Components
 * @memberof UI
 * @example
 * webViewerInstance.UI.Components.someComponent
 * webViewerInstance.UI.Components.someAPI()
 */
import DataElements from 'constants/dataElement';

const defaultModularHeaders = {
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
      'default-ribbon-group',
      'searchPanelToggle',
      'notesPanelToggle'
    ]
  },
  'tools-header': {
    dataElement: 'tools-header',
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
const defaultModularComponents = {
  filePickerButton: {
    dataElement: 'filePickerButton',
    title: 'action.openFile',
    label: 'action.openFile',
    icon: 'icon-header-file-picker-line',
    hidden: true,
    type: 'presetButton',
  },
  downloadButton: {
    dataElement: 'downloadButton',
    title: 'action.download',
    label: 'action.download',
    icon: 'icon-download',
    hidden: false,
    type: 'presetButton',
  },
  saveAsButton: {
    dataElement: 'saveAsButton',
    title: 'saveModal.saveAs',
    isActive: false,
    label: 'saveModal.saveAs',
    icon: 'icon-save',
    hidden: false,
    type: 'presetButton',
  },
  printButton: {
    dataElement: 'printButton',
    title: 'action.print',
    isActive: false,
    label: 'action.print',
    icon: 'icon-header-print-line',
    hidden: false,
    type: 'presetButton',
  },
  undefined: {},
  createPortfolioButton: {
    dataElement: 'createPortfolioButton',
    title: 'portfolio.createPDFPortfolio',
    isActive: false,
    label: 'portfolio.createPDFPortfolio',
    icon: 'icon-pdf-portfolio',
    hidden: false,
    type: 'presetButton',
  },
  settingsButton: {
    dataElement: 'settingsButton',
    title: 'option.settings.settings',
    isActive: false,
    label: 'option.settings.settings',
    icon: 'icon-header-settings-line',
    hidden: false,
    type: 'presetButton',
  },
  'divider-0.1': {
    dataElement: 'divider-0.1',
    type: 'divider'
  },
  'left-panel-toggle': {
    dataElement: 'left-panel-toggle',
    title: 'Left Panel',
    type: 'toggleButton',
    img: 'icon-header-sidebar-line',
    toggleElement: 'customLeftPanel'
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
  panToolButton: {
    dataElement: 'panToolButton',
    type: 'toolButton',
    toolName: 'Pan'
  },
  annotationEditToolButton: {
    dataElement: 'annotationEditToolButton',
    type: 'toolButton',
    toolName: 'AnnotationEdit'
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
      'left-panel-toggle',
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
    style: {}
  },
  'toolbarGroup-View': {
    dataElement: 'toolbarGroup-View',
    title: 'View',
    type: 'ribbonItem',
    label: 'View',
    groupedItems: [],
    toolbarGroup: 'toolbarGroup-View'
  },
  'toolbarGroup-Annotate': {
    dataElement: 'toolbarGroup-Annotate',
    title: 'Annotate',
    type: 'ribbonItem',
    label: 'Annotate',
    groupedItems: [
      'annotateGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Annotate'
  },
  'toolbarGroup-Shapes': {
    dataElement: 'toolbarGroup-Shapes',
    title: 'Shapes',
    type: 'ribbonItem',
    label: 'Shapes',
    groupedItems: [
      'shapesGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Shapes'
  },
  'toolbarGroup-Insert': {
    dataElement: 'toolbarGroup-Insert',
    title: 'Insert',
    type: 'ribbonItem',
    label: 'Insert',
    groupedItems: [
      'insertGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Insert'
  },
  'toolbarGroup-Measure': {
    dataElement: 'toolbarGroup-Measure',
    title: 'Measure',
    type: 'ribbonItem',
    label: 'Measure',
    groupedItems: [
      'measureGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Measure'
  },
  'toolbarGroup-Redact': {
    dataElement: 'toolbarGroup-Redact',
    title: 'Redact',
    type: 'ribbonItem',
    label: 'Redact',
    groupedItems: [
      'redactionGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Redact'
  },
  'toolbarGroup-Edit': {
    dataElement: 'toolbarGroup-Edit',
    title: 'Edit',
    type: 'ribbonItem',
    label: 'Edit',
    groupedItems: [
      'editGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Edit'
  },
  'toolbarGroup-EditText': {
    dataElement: 'toolbarGroup-EditText',
    title: 'Content Edit',
    type: 'ribbonItem',
    label: 'Content Edit',
    groupedItems: [
      'contentEditGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-EditText'
  },
  'toolbarGroup-FillAndSign': {
    dataElement: 'toolbarGroup-FillAndSign',
    title: 'Fill and Sign',
    type: 'ribbonItem',
    label: 'Fill and Sign',
    groupedItems: [
      'fillAndSignGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-FillAndSign'
  },
  'toolbarGroup-Forms': {
    dataElement: 'toolbarGroup-Forms',
    title: 'Forms',
    type: 'ribbonItem',
    label: 'Forms',
    groupedItems: [
      'formsGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Forms'
  },
  'default-ribbon-group': {
    dataElement: 'default-ribbon-group',
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
      'toolbarGroup-Forms'
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
  notesPanelToggle: {
    dataElement: 'notesPanelToggle',
    title: 'component.notesPanel',
    type: 'toggleButton',
    img: 'icon-header-chat-line',
    toggleElement: 'notesPanel'
  },
  highlightToolButton: {
    dataElement: 'highlightToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateTextHighlight'
  },
  underlineToolButton: {
    dataElement: 'underlineToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateTextUnderline'
  },
  strikeoutToolButton: {
    dataElement: 'strikeoutToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateTextStrikeout'
  },
  squigglyToolButton: {
    dataElement: 'squigglyToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateTextSquiggly'
  },
  freeTextToolButton: {
    dataElement: 'freeTextToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateFreeText'
  },
  markInsertTextToolButton: {
    dataElement: 'markInsertTextToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateMarkInsertText'
  },
  markReplaceTextToolButton: {
    dataElement: 'markReplaceTextToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateMarkReplaceText'
  },
  freeHandToolButton: {
    dataElement: 'freeHandToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateFreeHand'
  },
  freeHandHighlightToolButton: {
    dataElement: 'freeHandHighlightToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateFreeHandHighlight'
  },
  stickyToolButton: {
    dataElement: 'stickyToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateSticky'
  },
  calloutToolButton: {
    dataElement: 'calloutToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateCallout'
  },
  'divider-0.4': {
    dataElement: 'divider-0.4',
    type: 'divider'
  },
  stylePanelToggle: {
    dataElement: 'stylePanelToggle',
    title: 'action.style',
    type: 'toggleButton',
    img: 'icon-style-panel-toggle',
    toggleElement: 'stylePanel'
  },
  'divider-0.5': {
    dataElement: 'divider-0.5',
    type: 'divider'
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
  eraserToolButton: {
    dataElement: 'eraserToolButton',
    type: 'toolButton',
    toolName: 'AnnotationEraserTool'
  },
  defaultAnnotationUtilities: {
    dataElement: 'defaultAnnotationUtilities',
    items: [
      'divider-0.5',
      'undoButton',
      'redoButton',
      'eraserToolButton'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  annotateToolsGroupedItems: {
    dataElement: 'annotateToolsGroupedItems',
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
    style: {}
  },
  annotateGroupedItems: {
    dataElement: 'annotateGroupedItems',
    items: [
      'annotateToolsGroupedItems',
      'divider-0.4',
      'stylePanelToggle',
      'defaultAnnotationUtilities',
    ],
    type: 'groupedItems',
    justifyContent: 'center',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  rectangleToolButton: {
    dataElement: 'rectangleToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateRectangle'
  },
  ellipseToolButton: {
    dataElement: 'ellipseToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateEllipse'
  },
  arcToolButton: {
    dataElement: 'arcToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateArc'
  },
  polygonToolButton: {
    dataElement: 'polygonToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreatePolygon'
  },
  cloudToolButton: {
    dataElement: 'cloudToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreatePolygonCloud'
  },
  lineToolButton: {
    dataElement: 'lineToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateLine'
  },
  polylineToolButton: {
    dataElement: 'polylineToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreatePolyline'
  },
  arrowToolButton: {
    dataElement: 'arrowToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateArrow'
  },
  shapesToolsGroupedItems: {
    dataElement: 'shapesToolsGroupedItems',
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
    style: {}
  },
  shapesGroupedItems: {
    dataElement: 'shapesGroupedItems',
    items: [
      'shapesToolsGroupedItems',
      'divider-0.4',
      'stylePanelToggle',
      'defaultAnnotationUtilities'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  rubberStampToolButton: {
    dataElement: 'rubberStampToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateRubberStamp'
  },
  signatureCreateToolButton: {
    dataElement: 'signatureCreateToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateSignature'
  },
  fileAttachmentButton: {
    dataElement: 'fileAttachmentButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateFileAttachment'
  },
  stampToolButton: {
    dataElement: 'stampToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateStamp'
  },
  insertToolsGroupedItems: {
    dataElement: 'insertToolsGroupedItems',
    items: [
      'rubberStampToolButton',
      'signatureCreateToolButton',
      'fileAttachmentButton',
      'stampToolButton',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  insertGroupedItems: {
    dataElement: 'insertGroupedItems',
    items: [
      'insertToolsGroupedItems',
      'divider-0.4',
      'stylePanelToggle',
      'defaultAnnotationUtilities',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  redactionToolButton: {
    dataElement: 'redactionToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateRedaction'
  },
  pageRedactionToggleButton: {
    dataElement: 'pageRedactionToggleButton',
    title: 'action.redactPages',
    type: 'toggleButton',
    img: 'icon-tool-page-redact',
    toggleElement: 'pageRedactionModal'
  },
  redactionPanelToggle: {
    dataElement: 'redactionPanelToggle',
    type: 'toggleButton',
    img: 'icon-redact-panel',
    toggleElement: 'redactionPanel'
  },
  redactionGroupedItems: {
    dataElement: 'redactionGroupedItems',
    items: [
      'redactionToolButton',
      'pageRedactionToggleButton',
      'redactionPanelToggle',
      'defaultAnnotationUtilities'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  distanceMeasurementToolButton: {
    dataElement: 'distanceMeasurementToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateDistanceMeasurement'
  },
  arcMeasurementToolButton: {
    dataElement: 'arcMeasurementToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateArcMeasurement'
  },
  perimeterMeasurementToolButton: {
    dataElement: 'perimeterMeasurementToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreatePerimeterMeasurement'
  },
  areaMeasurementToolButton: {
    dataElement: 'areaMeasurementToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateAreaMeasurement'
  },
  ellipseMeasurementToolButton: {
    dataElement: 'ellipseMeasurementToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateEllipseMeasurement'
  },
  rectangularAreaMeasurementToolButton: {
    dataElement: 'rectangularAreaMeasurementToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateRectangularAreaMeasurement'
  },
  countMeasurementToolButton: {
    dataElement: 'countMeasurementToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateCountMeasurement'
  },
  measureGroupedItems: {
    dataElement: 'measureGroupedItems',
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
      'defaultAnnotationUtilities'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  cropToolButton: {
    dataElement: 'cropToolButton',
    type: 'toolButton',
    toolName: 'CropPage'
  },
  snippingToolButton: {
    dataElement: 'snippingToolButton',
    type: 'toolButton',
    toolName: 'SnippingTool'
  },
  editGroupedItems: {
    dataElement: 'editGroupedItems',
    items: [
      'cropToolButton',
      'snippingToolButton',
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  addParagraphToolGroupButton: {
    dataElement: 'addParagraphToolGroupButton',
    type: 'toolButton',
    toolName: 'AddParagraphTool'
  },
  addImageContentToolGroupButton: {
    dataElement: 'addImageContentToolGroupButton',
    type: 'toolButton',
    toolName: 'AddImageContentTool'
  },
  'divider-0.6': {
    dataElement: 'divider-0.6',
    type: 'divider'
  },
  contentEditButton: {
    dataElement: 'contentEditButton',
    type: 'presetButton',
    buttonType: 'contentEditButton'
  },
  contentEditGroupedItems: {
    dataElement: 'contentEditGroupedItems',
    items: [
      'addParagraphToolGroupButton',
      'addImageContentToolGroupButton',
      'divider-0.6',
      'contentEditButton'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  crossStampToolButton: {
    dataElement: 'crossStampToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateCrossStamp'
  },
  checkStampToolButton: {
    dataElement: 'checkStampToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateCheckStamp'
  },
  dotStampToolButton: {
    dataElement: 'dotStampToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateDotStamp'
  },
  calendarToolButton: {
    dataElement: 'calendarToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateDateFreeText'
  },
  fillAndSignGroupedItems: {
    dataElement: 'fillAndSignGroupedItems',
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
      'defaultAnnotationUtilities'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  signatureFieldButton: {
    dataElement: 'signatureFieldButton',
    type: 'toolButton',
    toolName: 'SignatureFormFieldCreateTool'
  },
  textFieldButton: {
    dataElement: 'textFieldButton',
    type: 'toolButton',
    toolName: 'TextFormFieldCreateTool'
  },
  checkboxFieldButton: {
    dataElement: 'checkboxFieldButton',
    type: 'toolButton',
    toolName: 'CheckBoxFormFieldCreateTool'
  },
  radioFieldButton: {
    dataElement: 'radioFieldButton',
    type: 'toolButton',
    toolName: 'RadioButtonFormFieldCreateTool'
  },
  listBoxFieldButton: {
    dataElement: 'listBoxFieldButton',
    type: 'toolButton',
    toolName: 'ListBoxFormFieldCreateTool'
  },
  comboBoxFieldButton: {
    dataElement: 'comboBoxFieldButton',
    type: 'toolButton',
    toolName: 'ComboBoxFormFieldCreateTool'
  },
  'divider-0.7': {
    dataElement: 'divider-0.7',
    type: 'divider'
  },
  formFieldEditButton: {
    dataElement: 'formFieldEditButton',
    type: 'presetButton',
    buttonType: 'formFieldEditButton'
  },
  'divider-0.8': {
    dataElement: 'divider-0.8',
    type: 'divider'
  },
  formsToolsGroupedItems: {
    dataElement: 'formsToolsGroupedItems',
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
    style: {}
  },
  formsGroupedItems: {
    dataElement: 'formsGroupedItems',
    items: [
      'formsToolsGroupedItems',
      'divider-0.8',
      'stylePanelToggle'
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
const defaultPanels = [
  {
    dataElement: 'stylePanel',
    render: 'stylePanel',
    location: 'left'
  },
  {
    dataElement: 'thumbnailPanel',
    render: 'thumbnailsPanel',
    location: 'left'
  },
  {
    dataElement: 'outlinePanel',
    render: 'outlinesPanel',
    location: 'left'
  },
  {
    dataElement: 'bookmarkPanel',
    render: 'bookmarksPanel',
    location: 'left'
  },
  {
    dataElement: 'layersPanel',
    render: 'layersPanel',
    location: 'left'
  },
  {
    dataElement: 'signatureListPanel',
    render: 'signatureListPanel',
    location: 'left'
  },
  {
    dataElement: 'fileAttachmentPanel',
    render: 'fileAttachmentPanel',
    location: 'left'
  },
  {
    dataElement: 'rubberStampPanel',
    render: 'rubberStampPanel',
    location: 'left'
  },
  {
    dataElement: 'textEditingPanel',
    render: 'textEditingPanel',
    location: 'right'
  },
  {
    dataElement: 'signaturePanel',
    render: 'signaturePanel',
    location: 'left'
  },
  {
    dataElement: 'portfolioPanel',
    render: 'portfolioPanel',
    location: 'left'
  },
  {
    render: 'tabPanel',
    dataElement: 'customLeftPanel',
    panelsList: [
      {
        render: 'thumbnailPanel'
      },
      {
        render: 'outlinePanel'
      },
      {
        render: 'bookmarkPanel'
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
    location: 'left'
  },
  {
    dataElement: 'notesPanel',
    render: 'notesPanel',
    location: 'right'
  },
  {
    dataElement: 'searchPanel',
    render: 'searchPanel',
    location: 'right'
  },
  {
    dataElement: 'redactionPanel',
    render: 'redactionPanel',
    location: 'right'
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
        'isActive': false,
        'hidden': false,
        'type': 'presetButton'
      },
      {
        'dataElement': 'filePickerButton',
        'presetDataElement': 'filePickerPresetButton',
        'icon': 'icon-header-file-picker-line',
        'label': 'action.openFile',
        'title': 'action.openFile',
        'hidden': false,
        'type': 'presetButton'
      },
      {
        'dataElement': 'downloadButton',
        'presetDataElement': 'downloadPresetButton',
        'icon': 'icon-download',
        'label': 'action.download',
        'title': 'action.download',
        'hidden': false,
        'type': 'presetButton'
      },
      {
        'dataElement': 'fullscreenButton',
        'presetDataElement': 'fullscreenPresetButton',
        'icon': 'icon-header-full-screen',
        'label': 'action.enterFullscreen',
        'title': 'action.enterFullscreen',
        'hidden': false,
        'type': 'presetButton'
      },
      {
        'dataElement': 'saveAsButton',
        'presetDataElement': 'saveAsPresetButton',
        'icon': 'icon-save',
        'label': 'saveModal.saveAs',
        'title': 'saveModal.saveAs',
        'isActive': false,
        'hidden': false,
        'type': 'presetButton'
      },
      {
        'dataElement': 'printButton',
        'presetDataElement': 'printPresetButton',
        'icon': 'icon-header-print-line',
        'label': 'action.print',
        'title': 'action.print',
        'isActive': false,
        'hidden': false,
        'type': 'presetButton'
      },
      'divider',
      {
        'dataElement': 'createPortfolioButton',
        'presetDataElement': 'createPortfolioPresetButton',
        'icon': 'icon-pdf-portfolio',
        'label': 'portfolio.createPDFPortfolio',
        'title': 'portfolio.createPDFPortfolio',
        'isActive': false,
        'hidden': false,
        'type': 'presetButton'
      },
      'divider',
      {
        'dataElement': 'settingsButton',
        'presetDataElement': 'settingsPresetButton',
        'icon': 'icon-header-settings-line',
        'label': 'option.settings.settings',
        'title': 'option.settings.settings',
        'isActive': false,
        'hidden': false,
        'type': 'presetButton'
      },
      'divider',
    ]
  }
};

export { defaultModularComponents, defaultModularHeaders, defaultPanels, defaultFlyoutMap };