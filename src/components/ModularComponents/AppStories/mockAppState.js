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
  'leftPanelButton': {
    ...defaultModularComponents['leftPanelButton']
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
  'menuButton': {
    ...defaultModularComponents['menuButton'],
  },
  groupedLeftHeaderButtons: {
    ...defaultModularComponents.groupedLeftHeaderButtons,
  },
  'toolbarGroup-View': {
    ...defaultModularComponents['toolbarGroup-View']
  },
  'toolbarGroup-Annotate': {
    ...defaultModularComponents['toolbarGroup-Annotate']
  },
  'toolbarGroup-Shapes': {
    ...defaultModularComponents['toolbarGroup-Shapes']
  },
  'toolbarGroup-Insert': {
    ...defaultModularComponents['toolbarGroup-Insert']
  },
  'toolbarGroup-Redact': {
    ...defaultModularComponents['toolbarGroup-Redact']
  },
  'toolbarGroup-Measure': {
    ...defaultModularComponents['toolbarGroup-Measure']
  },
  'toolbarGroup-Edit': {
    ...defaultModularComponents['toolbarGroup-Edit']
  },
  'toolbarGroup-FillAndSign': {
    ...defaultModularComponents['toolbarGroup-FillAndSign']
  },
  'toolbarGroup-Forms': {
    dataElement: 'toolbarGroup-Forms',
    title: 'Forms',
    type: 'ribbonItem',
    label: 'Forms',
    groupedItems: [
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
      'toolbarGroup-FillAndSign'
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

export const mockLeftHeader = {
  'modularComponents': {
    'printButton': {
      'dataElement': 'printButton',
      'buttonType': 'printButton',
      'title': 'action.print',
      'isActive': false,
      'label': 'action.print',
      'icon': 'icon-header-print-line',
      'hidden': false,
      'type': 'presetButton'
    },
    'highlightToolButton': {
      'dataElement': 'highlightToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateTextHighlight'
    },
    'underlineToolButton': {
      'dataElement': 'underlineToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateTextUnderline'
    },
    'strikeoutToolButton': {
      'dataElement': 'strikeoutToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateTextStrikeout'
    },
    'rectangleToolButton': {
      'dataElement': 'rectangleToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateRectangle'
    },
    'ellipseToolButton': {
      'dataElement': 'ellipseToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateEllipse'
    },
    'arcToolButton': {
      'dataElement': 'arcToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateArc'
    },
    'annotateToolsGroupedItems': {
      'dataElement': 'annotateToolsGroupedItems',
      'items': [
        'highlightToolButton',
        'underlineToolButton',
        'strikeoutToolButton',
      ],
      'type': 'groupedItems',
      'justifyContent': 'center',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'shapesToolsGroupedItems': {
      'dataElement': 'shapesToolsGroupedItems',
      'items': [
        'rectangleToolButton',
        'ellipseToolButton',
        'arcToolButton',
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'toolbarGroup-View': {
      'dataElement': 'toolbarGroup-View',
      'title': 'View',
      'type': 'ribbonItem',
      'label': 'View',
      'groupedItems': [],
      'toolbarGroup': 'toolbarGroup-View'
    },
    'toolbarGroup-Annotate': {
      'dataElement': 'toolbarGroup-Annotate',
      'title': 'Annotate',
      'type': 'ribbonItem',
      'label': 'Annotate',
      'groupedItems': [
        'annotateToolsGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-Annotate'
    },
    'toolbarGroup-Shapes': {
      'dataElement': 'toolbarGroup-Shapes',
      'title': 'Shapes',
      'type': 'ribbonItem',
      'label': 'Shapes',
      'groupedItems': [
        'shapesToolsGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-Shapes'
    },
    'default-ribbon-group': {
      'dataElement': 'default-ribbon-group',
      'items': [
        'toolbarGroup-View',
        'toolbarGroup-Annotate',
        'toolbarGroup-Shapes',
      ],
      'type': 'ribbonGroup',
      'justifyContent': 'start',
      'grow': 2,
      'gap': 12,
      'alwaysVisible': false
    },
  },
  'modularHeaders': {
    'default-left-header': {
      'dataElement': 'default-left-header',
      'placement': 'left',
      'grow': 0,
      'gap': 12,
      'position': 'start',
      'float': false,
      'stroke': true,
      'dimension': {
        'paddingTop': 8,
        'paddingBottom': 8,
        'borderWidth': 1
      },
      'style': {},
      'items': [
        'printButton',
        'default-ribbon-group',
      ]
    },
    'tools-header': {
      'dataElement': 'tools-header',
      'placement': 'top',
      'justifyContent': 'center',
      'grow': 0,
      'gap': 12,
      'position': 'end',
      'float': false,
      'stroke': true,
      'dimension': {
        'paddingTop': 8,
        'paddingBottom': 8,
        'borderWidth': 1
      },
      'style': {},
      'items': [
        'annotateToolsGroupedItems',
        'shapesToolsGroupedItems',
      ]
    },
  },
  'panels': {
  },
  'flyouts': {
  }
};