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
      'fillAndSignGroupedItems'
    ]
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
      borderColor: 'var(--gray-5)'
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
    icon: 'icon-header-file-picker-line'
  },
  downloadButton: {
    dataElement: 'downloadButton',
    title: 'action.download',
    label: 'action.download',
    icon: 'icon-download'
  },
  saveAsButton: {
    dataElement: 'saveAsButton',
    title: 'saveModal.saveAs',
    isActive: false,
    label: 'saveModal.saveAs',
    icon: 'icon-save'
  },
  printButton: {
    dataElement: 'printButton',
    title: 'action.print',
    isActive: false,
    label: 'action.print',
    icon: 'icon-header-print-line'
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
    icon: 'icon-header-settings-line'
  },
  'divider-0.204250627209541': {
    dataElement: 'divider-0.204250627209541',
    type: 'divider'
  },
  'left-panel-toggle': {
    dataElement: 'left-panel-toggle',
    title: 'Left Panel',
    type: 'toggleButton',
    img: 'icon-header-sidebar-line',
    toggleElement: 'leftPanel'
  },
  'view-controls': {
    dataElement: 'view-controls',
    type: 'viewControls'
  },
  'divider-0.6224949301886946': {
    dataElement: 'divider-0.6224949301886946',
    type: 'divider'
  },
  'zoom-container': {
    dataElement: 'zoom-container',
    type: 'zoom'
  },
  'divider-0.9438428108367993': {
    dataElement: 'divider-0.9438428108367993',
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
  'divider-0.09340446869658314': {
    dataElement: 'divider-0.09340446869658314',
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
      'divider-0.204250627209541',
      'left-panel-toggle',
      'view-controls',
      'divider-0.6224949301886946',
      'zoom-container',
      'divider-0.9438428108367993',
      'panToolButton',
      'annotationEditToolButton',
      'divider-0.09340446869658314'
    ],
    type: 'groupedItems',
    grow: 1,
    gap: 12,
    alwaysVisible: true,
    style: {}
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
  underlineToolButton: {
    dataElement: 'underlineToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateTextUnderline'
  },
  highlightToolButton: {
    dataElement: 'highlightToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateTextHighlight'
  },
  rectangleToolButton: {
    dataElement: 'rectangleToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateRectangle'
  },
  freeTextToolButton: {
    dataElement: 'freeTextToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateFreeText'
  },
  squigglyToolButton: {
    dataElement: 'squigglyToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateTextSquiggly'
  },
  strikeoutToolButton: {
    dataElement: 'strikeoutToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateTextStrikeout'
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
    dataElement: 'freeHandToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateFreeHand'
  },
  freeHandHighlightToolButton: {
    dataElement: 'freeHandHighlightToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateFreeHandHighlight'
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
  arcToolButton: {
    dataElement: 'arcToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateArc'
  },
  ellipseToolButton: {
    dataElement: 'ellipseToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateEllipse'
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
    dataElement: 'rubberStampToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateRubberStamp'
  },
  signatureCreateToolButton: {
    dataElement: 'signatureCreateToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateSignature'
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
    dataElement: 'redactionToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateRedaction'
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
  cloudyRectangularAreaMeasurementToolButton: {
    dataElement: 'cloudyRectangularAreaMeasurementToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateCloudyRectangularAreaMeasurement'
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
    dataElement: 'cropToolButton',
    type: 'toolButton',
    toolName: 'CropPage'
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