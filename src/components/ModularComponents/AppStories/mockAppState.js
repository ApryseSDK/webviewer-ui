import { defaultModularHeaders, defaultModularComponents } from 'src/redux/modularComponents';
import { ITEM_TYPE, PRESET_BUTTON_TYPES } from 'constants/customizationVariables';

export const mockHeadersNormalized = {
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
      'notesPanelToggle',
    ]
  },
  'tools-header': {
    ...defaultModularHeaders['tools-header'],
  },
  'bottomHeader-23ds': {
    dataElement: 'bottomHeader-23ds',
    placement: 'bottom',
    grow: 0,
    gap: 12,
    position: 'center',
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
      borderColor: 'var(--gray-6)'
    },
    items: [
      'page-controls-container'
    ]
  }
};

export const mockModularComponents = {
  filePickerButton: {
    dataElement: 'filePickerButton',
    title: 'action.openFile',
    label: 'action.openFile',
    icon: 'icon-header-file-picker-line',
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.FILE_PICKER,
  },
  downloadButton: {
    dataElement: 'downloadButton',
    title: 'action.download',
    label: 'action.download',
    icon: 'icon-download',
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.DOWNLOAD,
  },
  saveAsButton: {
    dataElement: 'saveAsButton',
    title: 'saveModal.saveAs',
    isActive: false,
    label: 'saveModal.saveAs',
    icon: 'icon-save',
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.SAVE_AS,
  },
  printButton: {
    dataElement: 'printButton',
    title: 'action.print',
    isActive: false,
    label: 'action.print',
    icon: 'icon-header-print-line',
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.PRINT,
  },
  undefined: {},
  createPortfolioButton: {
    dataElement: 'createPortfolioButton',
    title: 'portfolio.createPDFPortfolio',
    isActive: false,
    label: 'portfolio.createPDFPortfolio',
    icon: 'icon-pdf-portfolio'
  },
  settingsButton: {
    dataElement: 'settingsButton',
    title: 'option.settings.settings',
    isActive: false,
    label: 'option.settings.settings',
    icon: 'icon-header-settings-line',
    type: ITEM_TYPE.PRESET_BUTTON,
    buttonType: PRESET_BUTTON_TYPES.SETTINGS,
  },
  'divider-0.1': {
    dataElement: 'divider-0.1',
    type: 'divider'
  },
  'divider-0.2': {
    dataElement: 'divider-0.2',
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
  'left-panel-toggle': {
    ...defaultModularComponents['left-panel-toggle']
  },
  'view-controls': {
    ...defaultModularComponents['view-controls']
  },
  'zoom-container': {
    ...defaultModularComponents['zoom-container'],
  },
  'panToolButton': {
    ...defaultModularComponents['panToolButton']
  },
  'annotationEditToolButton': {
    ...defaultModularComponents['annotationEditToolButton']
  },
  'menu-toggle-button': {
    ...defaultModularComponents['menu-toggle-button'],
  },
  groupedLeftHeaderButtons: {
    ...defaultModularComponents.groupedLeftHeaderButtons,
  },
  'view-ribbon-item': {
    dataElement: 'view-ribbon-item',
    title: 'View',
    type: 'ribbonItem',
    label: 'View',
    groupedItems: [],
    toolbarGroup: 'toolbarGroup-View'
  },
  'annotations-ribbon-item': {
    dataElement: 'annotations-ribbon-item',
    title: 'Annotate',
    type: 'ribbonItem',
    label: 'Annotate',
    groupedItems: [
      'annotateGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Annotate'
  },
  'shapes-ribbon-item': {
    dataElement: 'shapes-ribbon-item',
    title: 'Shapes',
    type: 'ribbonItem',
    label: 'Shapes',
    groupedItems: [
      'shapesGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Shapes'
  },
  'insert-ribbon-item': {
    dataElement: 'insert-ribbon-item',
    title: 'Insert',
    type: 'ribbonItem',
    label: 'Insert',
    groupedItems: [
      'insertGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Insert'
  },
  'redaction-ribbon-item': {
    dataElement: 'redaction-ribbon-item',
    title: 'Redact',
    type: 'ribbonItem',
    label: 'Redact',
    groupedItems: [
      'redactionGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Redact'
  },
  'measure-ribbon-item': {
    dataElement: 'measure-ribbon-item',
    title: 'Measure',
    type: 'ribbonItem',
    label: 'Measure',
    groupedItems: [
      'measureGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Measure'
  },
  'edit-ribbon-item': {
    dataElement: 'edit-ribbon-item',
    title: 'Edit',
    type: 'ribbonItem',
    label: 'Edit',
    groupedItems: [
      'editGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-Edit'
  },
  'fillAndSign-ribbon-item': {
    dataElement: 'fillAndSign-ribbon-item',
    title: 'Fill and Sign',
    type: 'ribbonItem',
    label: 'Fill and Sign',
    groupedItems: [
      'fillAndSignGroupedItems'
    ],
    toolbarGroup: 'toolbarGroup-FillAndSign'
  },
  'default-ribbon-group': {
    dataElement: 'default-ribbon-group',
    items: [
      'view-ribbon-item',
      'annotations-ribbon-item',
      'shapes-ribbon-item',
      'insert-ribbon-item',
      'redaction-ribbon-item',
      'measure-ribbon-item',
      'edit-ribbon-item',
      'fillAndSign-ribbon-item'
    ],
    type: 'ribbonGroup',
    justifyContent: 'start',
    grow: 2,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  searchPanelToggle: {
    ...defaultModularComponents.searchPanelToggle,
  },
  notesPanelToggle: {
    ...defaultModularComponents.notesPanelToggle,
  },
  underlineToolButton: {
    ...defaultModularComponents.underlineToolButton,
  },
  highlightToolButton: {
    ...defaultModularComponents.highlightToolButton,
  },
  rectangleToolButton: {
    ...defaultModularComponents.rectangleToolButton,
  },
  freeTextToolButton: {
    ...defaultModularComponents.freeTextToolButton,
  },
  squigglyToolButton: {
    ...defaultModularComponents.squigglyToolButton,
  },
  strikeoutToolButton: {
    ...defaultModularComponents.strikeoutToolButton,
  },
  'divider-0.12046025247094039': {
    dataElement: 'divider-0.12046025247094039',
    type: 'divider'
  },
  stylePanelToggle: {
    dataElement: 'stylePanelToggle',
    title: 'stylePanel.headings.styles',
    type: 'toggleButton',
    img: 'icon-style-panel-toggle',
    toggleElement: 'stylePanel'
  },
  'divider-0.3460871740070717': {
    dataElement: 'divider-0.3460871740070717',
    type: 'divider'
  },
  undoButton: {
    ...defaultModularComponents.undoButton
  },
  redoButton: {
    ...defaultModularComponents.redoButton
  },
  eraserToolButton: {
    ...defaultModularComponents.eraserToolButton
  },
  defaultAnnotationUtilities: {
    dataElement: 'defaultAnnotationUtilities',
    items: [
      'divider-0.12046025247094039',
      'stylePanelToggle',
      'divider-0.3460871740070717',
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
  annotateGroupedItems: {
    dataElement: 'annotateGroupedItems',
    items: [
      'underlineToolButton',
      'highlightToolButton',
      'rectangleToolButton',
      'freeTextToolButton',
      'squigglyToolButton',
      'strikeoutToolButton',
      'defaultAnnotationUtilities'
    ],
    type: 'groupedItems',
    justifyContent: 'center',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  freeHandToolButton: {
    ...defaultModularComponents.freeHandToolButton
  },
  freeHandHighlightToolButton: {
    ...defaultModularComponents.freeHandHighlightToolButton
  },
  lineToolButton: {
    ...defaultModularComponents.lineToolButton
  },
  polylineToolButton: {
    ...defaultModularComponents.polylineToolButton
  },
  arrowToolButton: {
    ...defaultModularComponents.arrowToolButton
  },
  arcToolButton: {
    ...defaultModularComponents.arcToolButton
  },
  ellipseToolButton: {
    ...defaultModularComponents.ellipseToolButton
  },
  polygonToolButton: {
    ...defaultModularComponents.polygonToolButton
  },
  cloudToolButton: {
    ...defaultModularComponents.cloudToolButton
  },
  shapesGroupedItems: {
    dataElement: 'shapesGroupedItems',
    items: [
      'rectangleToolButton',
      'freeHandToolButton',
      'freeHandHighlightToolButton',
      'lineToolButton',
      'polylineToolButton',
      'arrowToolButton',
      'arcToolButton',
      'ellipseToolButton',
      'polygonToolButton',
      'cloudToolButton',
      'defaultAnnotationUtilities'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  rubberStampToolButton: {
    ...defaultModularComponents.rubberStampToolButton,
  },
  signatureCreateToolButton: {
    ...defaultModularComponents.signatureCreateToolButton,
  },
  insertGroupedItems: {
    dataElement: 'insertGroupedItems',
    items: [
      'rubberStampToolButton',
      'signatureCreateToolButton',
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
  redactionToolButton: {
    ...defaultModularComponents.redactionToolButton,
  },
  panel2Button: {
    dataElement: 'panel2Button',
    type: 'toggleButton',
    img: 'icon-redact-panel',
    toggleElement: 'redactPanel_1'
  },
  redactionGroupedItems: {
    dataElement: 'redactionGroupedItems',
    items: [
      'redactionToolButton',
      'panel2Button',
      'defaultAnnotationUtilities'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  distanceMeasurementToolButton: {
    ...defaultModularComponents.distanceMeasurementToolButton,
  },
  arcMeasurementToolButton: {
    ...defaultModularComponents.arcMeasurementToolButton,
  },
  perimeterMeasurementToolButton: {
    ...defaultModularComponents.perimeterMeasurementToolButton,
  },
  areaMeasurementToolButton: {
    ...defaultModularComponents.areaMeasurementToolButton,
  },
  ellipseMeasurementToolButton: {
    ...defaultModularComponents.ellipseMeasurementToolButton,
  },
  rectangularAreaMeasurementToolButton: {
    ...defaultModularComponents.rectangularAreaMeasurementToolButton,
  },
  countMeasurementToolButton: {
    ...defaultModularComponents.countMeasurementToolButton,
  },
  cloudyRectangularAreaMeasurementToolButton: {
    dataElement: 'cloudyRectangularAreaMeasurementToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateCloudyRectangularAreaMeasurement'
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
      'cloudyRectangularAreaMeasurementToolButton',
      'countMeasurementToolButton',
      'defaultAnnotationUtilities'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {}
  },
  cropToolButton: {
    ...defaultModularComponents.cropToolButton,
  },
  editGroupedItems: {
    dataElement: 'editGroupedItems',
    items: [
      'cropToolButton',
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
  fillAndSignGroupedItems: {
    dataElement: 'fillAndSignGroupedItems',
    items: [
      'rubberStampToolButton',
      'defaultAnnotationUtilities'
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
  },
  'grouped-item': {
    items: ['button1', 'button2']
  },
  'group1': {
    items: ['button8', 'button9'],
  },
};