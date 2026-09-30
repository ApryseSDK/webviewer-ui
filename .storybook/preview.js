import core from 'core';
import { withThemeByClassName } from '@storybook/addon-themes';
import I18nDecorator from './I18nDecorator';
import '../src/index.scss';
import '../src/components/App/App.scss';
import './storybook-global.css';
import { loadDefaultFonts } from '../src/helpers/loadFont';
import { parse } from '../src/helpers/cssVariablesParser';
import Theme from '../src/constants/theme';
import { approvedStamp } from './static/assets/standardStamps';
import { customRubberStamps } from './static/assets/customStamps';
import modularUILightModeString from '../src/constants/lightWCAG.scss?raw';
import modularUIDarkModeString from '../src/constants/darkWCAG.scss?raw';
import lightModeString from '../src/constants/light.scss?raw';
import darkModeString from '../src/constants/dark.scss?raw';
import { allModes } from './modes';
import i18n from 'i18next';
import * as LayoutNormalizer from '../../core/src/namespaces/Core/OfficeEditor/Manager/Layout/LayoutNormalizer';
import { convertBetweenUnits } from '../../core/src/namespaces/Core/OfficeEditor/Utilities';
import {
  storybookViewports,
} from '../src/helpers/storybookParams';

// We add this class to the StoryBook root element to mimic how we have
// structured our classes in the UI, where everything is wrapped by the App class.
// The Vitest addon loads preview annotations before the Storybook root exists, so
// use the browser test body as the equivalent App wrapper in that environment.
const storybookRoot = document.getElementById('storybook-root');
(storybookRoot || document.body).classList.add('App');
window.storybookDisableViewerElementMock = false;

function noop() {
}


loadDefaultFonts();

const setThemeDecorator = (storyFn, context) => {
  const { theme, addonRtl } = context.globals;
  const isLegacyUI = context.parameters?.legacyUI;
  let themeVarString = theme === Theme.DARK ? modularUIDarkModeString : modularUILightModeString;
  if (isLegacyUI) {
    themeVarString = theme === Theme.DARK ? darkModeString : lightModeString;
  }
  const root = document.documentElement;
  const themeVariables = parse(themeVarString);
  Object.keys(themeVariables).forEach((key) => {
    const themeVariable = themeVariables[key];
    root.style.setProperty(`--${key}`, themeVariable);
  });

  // *Note* We dont actually change the language to Urdu in the UI in storybook as this breaks many tests that look for English text.
  const targetLang = addonRtl === 'rtl' ? 'ur' : 'en';
  if (i18n.language !== targetLang) {
    i18n.changeLanguage(targetLang);
  }

  return storyFn();
};

const viewerMockToggleDecorator = (storyFn, context) => {
  const disableMock = context.parameters?.disableViewerElementMock ?? false;
  window.storybookDisableViewerElementMock = disableMock;
  return storyFn();
};

// Some helpful mocked annotations
let rectangle;
let freeText;
let distanceMeasurement;

let docType = 'pdf';
window.setDocType = (type) => {
  console.log('setDocType', type);
  docType = type;
};

const mockTool = {
  name: 'AnnotationCreateFreeHand',
  defaults: {
    StrokeColor: {
      R: 0,
      G: 122,
      B: 59,
      A: 1,
      toHexString: () => '#007a3b'
    },
    StrokeThickness: 1,
    Opacity: 1,
  },
  clearSignatureCanvas: noop,
  setSignatureCanvas: noop,
  setSignature: noop,
  resizeCanvas: noop,
  drawCustomStamp: () => 300,
  clearOutlineDestination: noop,
  clearLocation: noop,
  setInitialsCanvas: noop,
  setInitials: noop,
  clearInitialsCanvas: noop,
  setStyles: noop,
  finish: noop,
  getIsCropping: () => false,
  getIsSnipping: () => false,
  setSnippingMode: noop,
  getPagesToCrop: noop,
  setCropMode: noop,
  addEventListener: noop,
  removeEventListener: noop,
};

let isReadOnly = false;
const mockAnnotationManager = {
  isReadOnlyModeEnabled: () => isReadOnly,
  enableReadOnlyMode: () => isReadOnly = true,
  getNumberOfGroups: () => 0,
  isAnnotationRedactable: () => false,
  drawAnnotationsFromList: noop,
  exportAnnotations: noop,
  redrawAnnotation: noop,
  redrawAnnotations: noop,
  getEditBoxManager: () => ({
    getEditor: () => null,
  }),
  getFormFieldCreationManager: () => ({
    isInFormFieldCreationMode: () => false,
    endFormFieldCreationMode: noop,
    addEventListener: noop,
    removeEventListener: noop,
  }),
  getDisplayAuthor: (userId) => userId,
  deselectAllAnnotations: noop,
  deselectAnnotations: noop,
  selectAnnotation: noop,
  jumpToAnnotation: noop,
  setAnnotationStyles: noop,
  updateAnnotationRichTextStyle: noop,
  getCurrentUser: noop,
  getSelectedAnnotations: () => [],
  getAnnotationsList: () => ([
    rectangle,
    freeText,
    distanceMeasurement,
  ]),
  addEventListener: noop,
  removeEventListener: noop,
  getGroupAnnotations: () => [],
  canModifyContents: () => true,
  canModify: () => true,
  setNoteContents: () => '',
  trigger: noop,
  hideAnnotations: noop,
  isCreateRedactionEnabled: noop,
  disableRedaction: noop,
  setAnnotationCanvasTransform: noop,
  drawAnnotations: noop,
  getFieldManager: () => ({
    isWidgetHighlightingEnabled: () => true,
  }),
};

const mockFormFieldCreationManager = {
  isInFormFieldCreationMode: () => false,
  startFormFieldCreationMode: noop,
  endFormFieldCreationMode: noop,
  addEventListener: noop,
  removeEventListener: noop,
};

function generateCanvasWithImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 116;
  canvas.height = 150;

  const ctx = canvas.getContext('2d');

  return new Promise((resolve) => {
    const img = new Image();
    img.src = "/assets/images/191_200x300.jpeg";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };
  });
}

const mockClipboard = {
  copy: () => { },
  paste: () => { },
  cut: () => { },
};

const mockDocument = {
  filename: 'Mock Document.pdf',
  getPageInfo: () => ({
    width: DEFAULT_PAGE_HEIGHT,
    height: DEFAULT_PAGE_WIDTH
  }),
  getType: () => docType,
  getFilename: () => 'Mock Document.pdf',
  loadCanvas: async ({ drawComplete }) => {
    const canvas = await generateCanvasWithImage();
    drawComplete(canvas);
  },
  getBookmarks: () => new Promise((res, rej) => res),
  getViewerCoordinates: () => ({ x: 0, y: 0 }),
  setLayersArray: noop,
  isWebViewerServerDocument: () => false,
  addEventListener: noop,
  removeEventListener: noop,
  isWebViewerServerDocument: noop,
  getOfficeEditor: () => mockOfficeEditor,
  getSpreadsheetEditorDocument: () => ({
  }),
  getLayersArray: async () => [],
};

const mockOfficeEditor = {
  areCursorsReady: () => true,
  getHeaderPosition: () => 80,
  getFooterPosition: () => 600,
  getHeaderPageType: () => 0,
  getFooterPageType: () => 0,
  getHeaderFooterMargins: () => ({ headerDistanceToTop: 1.27, footerDistanceToBottom: 1.27 }),
  getDifferentFirstPage: () => false,
  getOddEven: () => false,
  getMaxHeaderFooterDistance: (pageNumber, unit = 'point') => {
    if (unit === 'inch') {
      return 3.6667;
    }
    if (unit === 'cm') {
      return 9.3134;
    }
    if (unit === 'mm') {
      return 93.134;
    }
    if (unit === 'point') {
      return 264.0024;
    }
  },
  getPageDimensions: (_, unit = 'point') => {
    const baseDimensions = {
      width: DEFAULT_PAGE_WIDTH * 0.75,
      height: DEFAULT_PAGE_HEIGHT * 0.75,
    };
    const conversionFactors = {
      point: 1,
      cm: 28.3465,
      inch: 72,
      mm: 283.465,
    };
    return {
      width: baseDimensions.width / conversionFactors[unit],
      height: baseDimensions.height / conversionFactors[unit],
    };
  },
  getAvailablePageWidth: () => 315,
  getSectionNumber: () => 1,
  getSectionMargins: (unit = 'cm') => {
    if (unit === 'cm') {
      return { left: 2.54, right: 2.54, top: 2.54, bottom: 2.54 }
    }
    if (unit === 'inch') {
      return { left: 1, right: 1, top: 1, bottom: 1 }
    }
    if (unit === 'mm') {
      return { left: 25.4, right: 25.4, top: 25.4, bottom: 25.4 }
    }
    if (unit === 'point') {
      return { left: 72, right: 72, top: 72, bottom: 72 }
    }
  },
  getEditingPageNumber: () => 1,
  getSectionColumns: () => [315]
}

const mockDisplayMode = {
  getVisiblePages: () => [1, 2],
  pageToWindow: () => ({ x: 0, y: 0 }),
  isContinuous: () => true,
}

const mockDisplayModeManager = {
  isVirtualDisplayEnabled: () => true,
  getDisplayMode: () => mockDisplayMode,
};

const mockAccessibleReadingOrderManager = {
  isInAccessibleReadingOrderMode: () => false,
  startAccessibleReadingOrderMode: noop,
  endAccessibleReadingOrderMode: noop,
  addEventListener: noop,
  removeEventListener: noop,
};

const mockPageImageSrc = '/assets/images/mock_document.jpeg';

const renderMockDocumentElement = (element) => {
  if (!element) {
    return;
  }
  if (window.storybookDisableViewerElementMock) {
    mockViewerElement = element;
    element.innerHTML = '';
    return;
  }
  mockViewerElement = element;
  element.classList.add('storybook-mock-document');
  element.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'storybook-mock-page';

  const pageImage = document.createElement('img');
  pageImage.src = mockPageImageSrc;
  pageImage.alt = 'Mock document page preview';

  page.appendChild(pageImage);
  element.appendChild(page);
};

let mockViewerElement = null;
let currentPage = 0;
const mockDocumentViewer = {
  doc: {},
  getDocument: () => mockDocument,
  getPageCount: () => 9,
  getAnnotationManager: () => mockAnnotationManager,
  getRotation: () => 0,
  getCompleteRotation: () => 0,
  clearSearchResults: noop,
  getTool: (toolName) => mockTool,
  setWatermark: noop,
  getPageHeight: () => DEFAULT_PAGE_HEIGHT,
  getPageWidth: () => DEFAULT_PAGE_WIDTH,
  setCurrentPage: (page) => {
    currentPage = page;
  },
  getCurrentPage: () => currentPage,
  setBookmarkIconShortcutVisibility: noop,
  displayBookmark: noop,
  addEventListener: noop,
  removeEventListener: noop,
  getAnnotationHistoryManager: noop,
  getMeasurementManager: noop,
  getToolModeMap: () => ({
  }),
  getWatermark: () => Promise.resolve(),
  getDisplayModeManager: () => mockDisplayModeManager,
  getContentEditHistoryManager: () => ({
    canUndo: noop,
    canRedo: noop,
  }),
  getViewerElement: () => mockViewerElement,
  setViewerElement: renderMockDocumentElement,
  setScrollViewElement: noop,
  scrollViewUpdated: noop,
  setBookmarkShortcutToggleOnFunction: noop,
  setBookmarkShortcutToggleOffFunction: noop,
  setUserBookmarks: noop,
  getToolMode: noop,
  getAnnotationsLoadedPromise: () => Promise.resolve(),
  refreshAll: noop,
  updateView: noop,
  getPageSearchResults: () => [],
  rotateClockwise: noop,
  getAccessibleReadingOrderManager: () => mockAccessibleReadingOrderManager,
  getSpreadsheetEditorManager: () => ({
    addEventListener: noop,
    getSelectedCells: () => [{
      getStyle: () => ({
        verticalAlignment: 1,
      })
    }],
    setSelectedCellsStyle: noop,
    getSelectedCellRange: () => ({
      firstRow: 0,
      lastRow: 0,
      firstColumn: 0,
      lastColumn: 0
    }),
    getSpreadsheetEditorClipboard: () => mockClipboard,
    getWorkbook: () => ({
      activeSheetIndex: 0,
      getSheetAt: () => ({}),
    }),
  }),
  SnapMode: {
    DEFAULT: 14,
    POINT_ON_LINE: 1,
    LINE_MID_POINT: 2,
    LINE_INTERSECTION: 4,
    PATH_ENDPOINT: 8,
    e_DefaultSnapMode: 14,
    e_PointOnLine: 1,
    e_LineMidpoint: 2,
    e_LineIntersection: 4,
    e_PathEndpoint: 8
  }
};

core.getTool = (toolName) => {
  if (toolName === 'AnnotationCreateRubberStamp') {
    return new MockRubberStampCreateTool();
  }
  return mockTool;
};
core.setToolMode = noop;
core.getToolMode = noop;
core.isFullPDFEnabled = () => { return true; };
core.addEventListener = () => { };
core.removeEventListener = () => { };
core.getFormFieldCreationManager = () => mockFormFieldCreationManager;
core.getDocumentViewer = () => mockDocumentViewer;
core.getDocumentViewers = () => [mockDocumentViewer];
core.getDocument = () => mockDocument;
core.getDisplayAuthor = (author) => author ? author : 'Duncan Idaho';
core.getAnnotationManager = () => mockAnnotationManager;
core.getDisplayModeObject = () => mockDisplayMode;
core.getCurrentPage = () => 1;
const mockScrollViewElement = {
  scrollTop: 0,
  addEventListener: noop,
  removeEventListener: noop,
  getBoundingClientRect: () => ({
    bottom: 726,
    height: 726,
    left: 0,
    right: 2149,
    top: 0,
    width: 2149,
    x: 0,
    y: 0,
  })
};
let scrollViewElement = mockScrollViewElement;
core.setScrollViewElement = (element) => {
  scrollViewElement = element || mockScrollViewElement;
};
core.getScrollViewElement = () => scrollViewElement;
core.setViewerElement = renderMockDocumentElement;
core.getViewerElement = () => mockViewerElement;
const contentEditManager = {
  isInContentEditMode: () => false,
  endContentEditMode: noop,
  addEventListener: noop,
  removeEventListener: noop,
}
core.getContentEditManager = () => contentEditManager;
core.getZoom = () => 1;
core.getOfficeEditor = () => mockOfficeEditor;

core.deselectAnnotations = () => [];

class MockTool {
  // Mock any methods here or mock a specific tool if needed
}

class MockMeasureMentTool {
  setSnapMode = noop;
  getSnapMode = () => core.getDocumentViewer().SnapMode.DEFAULT;
  Measure = {};
}

class MockRubberStampCreateTool {
  static FILL_COLORS = ['#4F9964', '#2A85D0', '#D65656'];
  static TEXT_COLORS = ['#FFFFFF', '#000000'];
  name = 'AnnotationCreateRubberStamp';

  getStandardStampAnnotations = () => [
    { Icon: 'Approved' },
    { Icon: 'As Is' },
    { Icon: 'Completed' },
    { Icon: 'Confidential' },
    { Icon: 'Departmental' },
    { Icon: 'Draft' },
    { Icon: 'Experimental' },
    { Icon: 'Expired' },
    { Icon: 'Final' },
    { Icon: 'For Comment' },
    { Icon: 'For Public Release' },
    { Icon: 'Information Only' },
    { Icon: 'Not Approved' },
    { Icon: 'Not For Public Release' },
    { Icon: 'Preliminary Results' },
    { Icon: 'Sold' },
    { Icon: 'Top Secret' },
    { Icon: 'Void' },
    { Icon: 'Sign Here' },
    { Icon: 'Witness' },
    { Icon: 'Initial Here' },
    { Icon: 'Accepted' },
    { Icon: 'Rejected' },
  ];
  getPreview = () => approvedStamp;
  getCustomStampAnnotations = () => customRubberStamps;
  formatCustomStampSubtitle = (subtitle) => subtitle.replace('$currentUser', 'Current User');
}

const getNewEmptyToolClass = (OtherTool) => {
  if (OtherTool) {
    return class MockToolNew extends OtherTool {
    };
  }
  return class MockToolNew extends MockTool {
  };
};

const RectangleCreateTool = getNewEmptyToolClass();

const defaultMockedScale = {
  pageScale: {
    value: 1,
    unit: 'in'
  },
  worldScale: {
    value: 1,
    unit: 'in'
  },
  toString: () => '1 in = 1 in',
  getScaleRatioAsArray: () => [[1, 'in'], [1, 'in']],
  isValid: () => true
};

class Scale {
  constructor(scale) {
    if (!scale) {
      return defaultMockedScale;
    }

    let pageScale;
    let worldScale;

    const isScaleObjectFormat = typeof scale === 'object' && scale.pageScale && scale.worldScale;
    const isScaleStringFormat = typeof scale === 'string';
    const isScaleArrayFormat = Array.isArray(scale) && scale.length === 2;

    if (isScaleObjectFormat) {
      pageScale = scale.pageScale;
      worldScale = scale.worldScale;
    } else if (isScaleStringFormat) {
      const [pageValue, pageUnit, worldValue, worldUnit] = scale.split(/[\s=]+/);
      pageScale = { value: parseFloat(pageValue), unit: pageUnit };
      worldScale = { value: parseFloat(worldValue), unit: worldUnit };
    } else if (isScaleArrayFormat) {
      pageScale = { value: scale[0][0], unit: scale[0][1] };
      worldScale = { value: scale[1][0], unit: scale[1][1] };
    } else {
      return {};
    }

    this.pageScale = pageScale;
    this.worldScale = worldScale;
  }

  toString() {
    return `${this.pageScale.value} ${this.pageScale.unit} = ${this.worldScale.value} ${this.worldScale.unit}`;
  }

  isValid() {
    return true;
  }

  getScaleRatioAsArray() {
    return [
      [this.pageScale.value, this.pageScale.unit],
      [this.worldScale.value, this.worldScale.unit],
    ];
  }
}

class EventHandler {
  constructor() {
    this._listeners = {};
  }
  addEventListener = (eventName, listener) => {
    (this._listeners[eventName] = this._listeners[eventName] || []).push(listener);
  };
  removeEventListener = (eventName, listener) => {
    this._listeners[eventName] = (this._listeners[eventName] || []).filter((l) => l !== listener);
  };
  trigger = (eventName, data) => {
    const args = Array.isArray(data) ? data : data === undefined ? [] : [data];
    (this._listeners[eventName] || []).slice().forEach((listener) => {
      try { listener(...args); } catch (e) { console.error(e); }
    });
  };
  triggerAsync = async (eventName, data) => this.trigger(eventName, data);
}

window.Core = {
  documentViewer: mockDocumentViewer,
  ContentEdit: {
    addEventListener: noop,
    removeEventListener: noop,
    getContentEditingFonts: () => Promise.resolve([]),
    Types: {
      TEXT: 'text',
      OBJECT: 'object',
    }
  },
  annotationManager: mockAnnotationManager,
  AnnotationManager: mockAnnotationManager,
  Actions: {
    URI: Object,
    GoTo: Object
  },
  Math: {
    Rect: Object,
  },
  Tools: {
    ToolNames: {
      'ARROW': 'AnnotationCreateArrow',
      'CALLOUT': 'AnnotationCreateCallout',
      'ELLIPSE': 'AnnotationCreateEllipse',
      'FREEHAND': 'AnnotationCreateFreeHand',
      'FREEHAND_HIGHLIGHT': 'AnnotationCreateFreeHandHighlight',
      'FREETEXT': 'AnnotationCreateFreeText',
      'MARK_INSERT_TEXT': 'AnnotationCreateMarkInsertText',
      'MARK_REPLACE_TEXT': 'AnnotationCreateMarkReplaceText',
      'DATE_FREETEXT': 'AnnotationCreateDateFreeText',
      'LINE': 'AnnotationCreateLine',
      'POLYGON': 'AnnotationCreatePolygon',
      'POLYGON_CLOUD': 'AnnotationCreatePolygonCloud',
      'POLYLINE': 'AnnotationCreatePolyline',
      'ARC': 'AnnotationCreateArc',
      'RECTANGLE': 'AnnotationCreateRectangle',
      'CALIBRATION_MEASUREMENT': 'AnnotationCreateCalibrationMeasurement',
      'DISTANCE_MEASUREMENT': 'AnnotationCreateDistanceMeasurement',
      'PERIMETER_MEASUREMENT': 'AnnotationCreatePerimeterMeasurement',
      'ARC_MEASUREMENT': 'AnnotationCreateArcMeasurement',
      'AREA_MEASUREMENT': 'AnnotationCreateAreaMeasurement',
      'RECTANGULAR_AREA_MEASUREMENT': 'AnnotationCreateRectangularAreaMeasurement',
      'ELLIPSE_MEASUREMENT': 'AnnotationCreateEllipseMeasurement',
      'COUNT_MEASUREMENT': 'AnnotationCreateCountMeasurement',
      'SIGNATURE': 'AnnotationCreateSignature',
      'STAMP': 'AnnotationCreateStamp',
      'FILEATTACHMENT': 'AnnotationCreateFileAttachment',
      'RUBBER_STAMP': 'AnnotationCreateRubberStamp',
      'FORM_FILL_CROSS': 'AnnotationCreateCrossStamp',
      'FORM_FILL_CHECKMARK': 'AnnotationCreateCheckStamp',
      'FORM_FILL_DOT': 'AnnotationCreateDotStamp',
      'STICKY': 'AnnotationCreateSticky',
      'HIGHLIGHT': 'AnnotationCreateTextHighlight',
      'SQUIGGLY': 'AnnotationCreateTextSquiggly',
      'STRIKEOUT': 'AnnotationCreateTextStrikeout',
      'UNDERLINE': 'AnnotationCreateTextUnderline',
      'REDACTION': 'AnnotationCreateRedaction',
      'TEXT_SELECT': 'TextSelect',
      'EDIT': 'AnnotationEdit',
      'PAN': 'Pan',
      'CONTENT_EDIT': 'ContentEditTool',
      'ADD_PARAGRAPH': 'AddParagraphTool',
      'ADD_IMAGE_CONTENT': 'AddImageContentTool',
      'CROP': 'CropPage',
      'SNIPPING': 'SnippingTool',
      'ERASER': 'AnnotationEraserTool',
      'TEXT_FORM_FIELD': 'TextFormFieldCreateTool',
      'SIG_FORM_FIELD': 'SignatureFormFieldCreateTool',
      'CHECK_BOX_FIELD': 'CheckBoxFormFieldCreateTool',
      'RADIO_FORM_FIELD': 'RadioButtonFormFieldCreateTool',
      'LIST_BOX_FIELD': 'ListBoxFormFieldCreateTool',
      'COMBO_BOX_FIELD': 'ComboBoxFormFieldCreateTool',
      'DATE_PICKER_FIELD': 'DatePickerFormFieldCreateTool',
      'CHANGEVIEW': 'AnnotationCreateChangeViewTool',
    },
    RubberStampCreateTool: MockRubberStampCreateTool,
    SignatureCreateTool: {
      SignatureTypes: {
        FULL_SIGNATURE: 'fullSignature',
        INITIALS: 'initialsSignature'
      },
    },
    CropPage: {
      getIsCropping: () => false,
    },
    RectangleCreateTool: RectangleCreateTool,
    PolygonCreateTool: getNewEmptyToolClass(),
    EllipseCreateTool: getNewEmptyToolClass(),
    PolygonCloudCreateTool: getNewEmptyToolClass(),
    EllipseMeasurementCreateTool: getNewEmptyToolClass(),
    AreaMeasurementCreateTool: getNewEmptyToolClass(MockMeasureMentTool),
    FreeTextCreateTool: getNewEmptyToolClass(),
    CalloutCreateTool: getNewEmptyToolClass(),
    TextUnderlineCreateTool: getNewEmptyToolClass(),
    TextHighlightCreateTool: getNewEmptyToolClass(),
    TextSquigglyCreateTool: getNewEmptyToolClass(),
    TextStrikeoutCreateTool: getNewEmptyToolClass(),
    CountMeasurementCreateTool: getNewEmptyToolClass(),
    DistanceMeasurementCreateTool: getNewEmptyToolClass(MockMeasureMentTool),
    ArcMeasurementCreateTool: getNewEmptyToolClass(MockMeasureMentTool),
    PerimeterMeasurementCreateTool: getNewEmptyToolClass(),
    RectangularAreaMeasurementCreateTool: getNewEmptyToolClass(),
    CloudyRectangularAreaMeasurementCreateTool: getNewEmptyToolClass(),
    RedactionCreateTool: getNewEmptyToolClass(),
    StampCreateTool: getNewEmptyToolClass(),
    TextFormFieldCreateTool: getNewEmptyToolClass(RectangleCreateTool),
    SignatureFormFieldCreateTool: getNewEmptyToolClass(RectangleCreateTool),
    FileAttachmentCreateTool: getNewEmptyToolClass(),
    StickyCreateTool: getNewEmptyToolClass(),
    ListBoxFormFieldCreateTool: getNewEmptyToolClass(RectangleCreateTool),
    MarkInsertTextCreateTool: getNewEmptyToolClass(),
    MarkReplaceTextCreateTool: getNewEmptyToolClass(),
    AnnotationEditTool: getNewEmptyToolClass(),
    ComboBoxFormFieldCreateTool: getNewEmptyToolClass(),
    FreeHandCreateTool: getNewEmptyToolClass(),
    FreeHandHighlightCreateTool: getNewEmptyToolClass(),
    ArcCreateTool: getNewEmptyToolClass(),
    LineCreateTool: getNewEmptyToolClass(),
    CropCreateTool: getNewEmptyToolClass(RectangleCreateTool),
    CheckBoxFormFieldCreateTool: getNewEmptyToolClass(RectangleCreateTool),
    RadioButtonFormFieldCreateTool: getNewEmptyToolClass(RectangleCreateTool),
    AddParagraphTool: getNewEmptyToolClass(),
    AddImageContentTool: getNewEmptyToolClass(),
    SnippingCreateTool: getNewEmptyToolClass(RectangleCreateTool),
    EraserTool: getNewEmptyToolClass(),
    GenericAnnotationCreateTool: getNewEmptyToolClass(),
    TextAnnotationCreateTool: getNewEmptyToolClass(),
  },
  getHashParameter: (hashParameter, defaultValue) => {
    if (hashParameter === 'a') {
      return true;
    }
    return defaultValue;
  },
  SupportedFileFormats: {
    CLIENT: [],
  },
  isBlendModeSupported: () => true,
  FontStyles: { BOLD: 'BOLD', ITALIC: 'ITALIC', UNDERLINE: 'UNDERLINE' },
  getCanvasMultiplier: () => 1,
  Scale,
  Document: {
    OfficeEditor: {
      MINIMUM_COLUMN_WIDTH_IN_POINTS: 36,
      DEFAULT_COLUMN_SPACING_IN_POINTS: 36,
      VERTICAL_MARGIN_LIMIT: 0.4,
      ToggleableStyles: {
        BOLD: 'bold',
        ITALIC: 'italic',
        UNDERLINE: 'underline',
      },
      ListStylePresets: {
        '0': 'BULLET',
        '1': 'BULLET_SQUARE',
        '2': 'SQUARE_BULLET',
        '3': 'DIAMOND',
        '4': 'CHECK',
        '5': 'ARROW',
        '6': 'NUMBER_LATIN_ROMAN_1',
        '7': 'NUMBER_DECIMAL',
        '8': 'NUMBER_LATIN_ROMAN_2',
        '10': 'LATIN_ROMAN',
        '11': 'ROMAN_LATIN_NUMBER'
      },
      HighlightColors: {
        YELLOW: '#FFFF00',
        GREEN: '#00FF00',
        CYAN: '#00FFFF',
        MAGENTA: '#FF00FF',
        BLUE: '#0000FF',
        RED: '#FF0000',
        DARKBLUE: '#000080',
        DARKCYAN: '#008080',
        DARKGREEN: '#008000',
        DARKMAGENTA: '#800080',
        DARKRED: '#800000',
        DARKYELLOW: '#808000',
        DARKGRAY: '#808080',
        LIGHTGRAY: '#B4B4B4',
        BLACK: '#000000',
      },
      EditMode: {
        EDITING: 'editing',
        REVIEWING: 'reviewing',
        VIEW_ONLY: 'viewOnly',
        PREVIEW: 'preview',
      },
      EditingStreamType: {
        BODY: 0,
        HEADER: 1,
        FOOTER: 2,
      },
      LayoutUnits: {
        CM: 'cm',
        MM: 'mm',
        INCH: 'inch',
        PHYSICAL_POINT: 'point',
      },
      Layout: {
        convertBetweenUnits,
        buildEqualColumnsConfig: LayoutNormalizer.buildEqualColumnsConfig,
        buildEqualColumnsConfigFromWidth: LayoutNormalizer.buildEqualColumnsConfigFromWidth,
      }
    },
  },
  setBasePath: noop,
  getAllowedFileExtensions: () => ['pdf', 'xod'],
  quillShadowDOMWorkaround: noop,
  getDocument: () => mockDocument,
  TYPES: {
    OBJECT: noop,
    ARRAY: noop,
    MULTI_TYPE: noop,
    OPTIONAL: noop,
    ONE_OF: noop,
  },
  checkTypes: noop,
  SpreadsheetEditor: {
    SpreadsheetEditorEditMode: {
      EDITING: 'editing',
      VIEW_ONLY: 'viewOnly'
    },
    SpreadsheetCommentState: {
      OPEN: 'open',
      RESOLVED: 'resolved'
    }
  },
  SaveOptions: {
    INCREMENTAL: 0x01,
    REMOVE_UNUSED: 0x02,
    HEX_STRINGS: 0x04,
    OMIT_XREF: 0x08,
    LINEARIZED: 0x10,
    COMPATIBILITY: 0x20,
  },
  EventHandler,
};

window.Core.Scale.getFormattedValue = (value, unit) => `${value} ${unit}`;

const DEFAULT_PAGE_HEIGHT = 792;
const DEFAULT_PAGE_WIDTH = 612;

window.documentViewer = {
  doc: {},
  getDocument: () => mockDocument,
  getPageCount: () => 9,
  getAnnotationManager: () => mockAnnotationManager,
  getAnnotationHistoryManager: () => ({}),
  getRotation: () => 0,
  clearSearchResults: noop,
  getTool: (toolName) => mockTool,
  setWatermark: noop,
  getPageHeight: () => DEFAULT_PAGE_HEIGHT,
  getPageWidth: () => DEFAULT_PAGE_WIDTH,
  setCurrentPage: (page) => {
  },
  setBookmarkIconShortcutVisibility: noop,
  displayBookmark: noop,
};


// For an example of how these mock classes are used refer to AnnotationStylePopupStories.js
// However, it is preferrable to mock your annotation objects directly in your stories. These mocks are largely
// to support stories for components that rely on code that is calling methods/objects from the window object.
// For an example of the preferred mocking method refer to RedactionPageGroup.stories.js
class MockAnnotation {
  getCustomData = () => '';
  static datePickerOptions = {};
  static MeasurementUnits = {};
  getReplies = () => [];
  getAssociatedNumber = () => null;
  getAttachments = () => [];
}

class MockWidgetAnnotation {
  getCustomData = () => '';
  getStatus = () => '';
  isReply = () => false;
  isGrouped = () => false;
  isContentEditPlaceholder = () => false;
  getContents = () => '';
  getReplies = () => [];
  getRichTextStyle = () => null;
  getAssociatedNumber = () => null;
  getAttachments = () => []
  getPageNumber = () => 1;
  getRect = () => ({ x1: 0, y1: 0, x2: 100, y2: 100 });
  getNoZoomReferencePoint = () => { };
};

class MockTextWidgetAnnotation extends MockWidgetAnnotation { };
class MockChoiceWidgetAnnotation extends MockWidgetAnnotation { };
class MockListWidgetAnnotation extends MockWidgetAnnotation { };
class MockSignatureWidgetAnnotation extends MockWidgetAnnotation { };
class MockButtonWidgetAnnotation extends MockWidgetAnnotation { };
class MockRadioButtonWidgetAnnotation extends MockWidgetAnnotation { };
class MockCheckButtonWidgetAnnotation extends MockWidgetAnnotation { };
class MockPushButtonWidgetAnnotation extends MockWidgetAnnotation { };
class MockDatePickerWidgetAnnotation extends MockWidgetAnnotation { };
class MockLinkAnnotation extends MockWidgetAnnotation { };
MockDatePickerWidgetAnnotation.datePickerOptions = {};

class MockLineAnnotation {
  isReply = () => false;
  isGrouped = () => false;
  isContentEditPlaceholder = () => false;
  getReplies = () => [];
  getAssociatedNumber = () => null;
  getStatus = () => '';
  getRect = () => ({ x1: 0, y1: 0, x2: 100, y2: 100 });
  getPageNumber = () => 1;
  getAttachments = () => [];
  getStartStyle = () => 'None';
  getEndStyle = () => 'None';
  getIntent = () => null;
  getLineLength = () => 10;
  Opacity = 1;
  StrokeThickness = 1;
};

class MockTextHighlightAnnotation {
  getCustomData = () => '';
  getReplies = () => [];
  getAssociatedNumber = () => null;
  getAttachments = () => [];
  getContents = () => 'Test';
  isReply = () => false;
  isGrouped = () => false;
  isContentEditPlaceholder = () => false;
  getRichTextStyle = () => { };
  getStatus = () => '';
  getPageNumber = () => 1;
};

class MockFreeTextAnnotation {
  static Intent = {
    FreeText: 'FreeText',
  }
  getIntent = () => 'FreeText';
  getRichTextStyle = () => null;
  getCustomData = () => '';
  setLineStyle = () => { };
  getEditor = () => { };
};

class MockRectangleAnnotation {
  getCustomData = () => '';
  isReply = () => false;
  isGrouped = () => false;
  isContentEditPlaceholder = () => false;
  getContents = () => '';
  getReplies = () => [];
  getRichTextStyle = () => null;
  getAssociatedNumber = () => null;
  getStatus = () => '';
  getAttachments = () => [];
  getRect = () => ({ x1: 0, y1: 0, x2: 100, y2: 100 });
  getPageNumber = () => 1;
  getNoZoomReferencePoint = () => { };
}

class MockEllipseAnnotation {
  getIntent = () => 'EllipseDimension';
  getCustomData = () => '';
}

class PolygonAnnotation {
  getCustomData = () => '';
  static datePickerOptions = {};
}

class RedactionAnnotation {
  getCustomData = () => '';
  static datePickerOptions = {};
}

class FileAttachmentAnnotation {
  getCustomData = () => '';
  static datePickerOptions = {};
}

window.Core.Annotations = {
  Annotation: MockAnnotation,
  FreeTextAnnotation: MockFreeTextAnnotation,
  FreeHandAnnotation: MockAnnotation,
  LineAnnotation: MockLineAnnotation,
  PolylineAnnotation: MockAnnotation,
  ArcAnnotation: MockAnnotation,
  PolygonAnnotation: PolygonAnnotation,
  EllipseAnnotation: MockEllipseAnnotation,
  StickyAnnotation: MockAnnotation,
  TextHighlightAnnotation: MockTextHighlightAnnotation,
  TextUnderlineAnnotation: MockAnnotation,
  TextSquigglyAnnotation: MockAnnotation,
  TextStrikeoutAnnotation: MockAnnotation,
  RedactionAnnotation: RedactionAnnotation,
  RectangleAnnotation: MockRectangleAnnotation,
  StampAnnotation: MockAnnotation,
  FileAttachmentAnnotation: FileAttachmentAnnotation,
  SoundAnnotation: MockAnnotation,
  Link: MockLinkAnnotation,
  CaretAnnotation: MockAnnotation,
  CustomAnnotation: MockAnnotation,
  WidgetAnnotation: MockWidgetAnnotation,
  TextWidgetAnnotation: MockTextWidgetAnnotation,
  ChoiceWidgetAnnotation: MockChoiceWidgetAnnotation,
  ListWidgetAnnotation: MockListWidgetAnnotation,
  SignatureWidgetAnnotation: MockSignatureWidgetAnnotation,
  ButtonWidgetAnnotation: MockButtonWidgetAnnotation,
  RadioButtonWidgetAnnotation: MockRadioButtonWidgetAnnotation,
  CheckButtonWidgetAnnotation: MockCheckButtonWidgetAnnotation,
  PushButtonWidgetAnnotation: MockPushButtonWidgetAnnotation,
  DatePickerWidgetAnnotation: MockDatePickerWidgetAnnotation,
  Forms: {
    Field: MockAnnotation,
  }
}

const colorToHexString = (color) => {
  if (typeof color === 'undefined' || color === null) {
    return null;
  }
  if (color['A'] === 0) {
    return null;
  }
  let r = color['R'].toString(16).toUpperCase();
  if (r.length < 2) {
    r = `0${r}`;
  }
  let g = color['G'].toString(16).toUpperCase();
  if (g.length < 2) {
    g = `0${g}`;
  }
  let b = color['B'].toString(16).toUpperCase();
  if (b.length < 2) {
    b = `0${b}`;
  }

  return `#${r}${g}${b}`;
};

const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

Core.Annotations.Color = class Color {
  constructor(R = 255, G = 0, B = 0) {
    if (typeof R === 'string' && R[0] === '#') {
      const { r, g, b } = hexToRgb(R);
      this.R = r;
      this.G = g;
      this.B = b;
      this.A = 1;
      this.toHexString = () => R;
    } else if (typeof R === 'object') {
      return R;
    } else {
      this.R = R;
      this.G = G;
      this.B = B;
      this.A = 1;
      this.toHexString = () => colorToHexString(this);
    }
  }
};

rectangle = new window.Core.Annotations.RectangleAnnotation();
rectangle.Author = 'Guest_1';
rectangle.getStatus = () => '';
rectangle.getCustomData = () => '';
rectangle.StrokeColor = new window.Core.Annotations.Color(255, 0, 0);

freeText = new window.Core.Annotations.FreeTextAnnotation();
freeText.Author = 'Guest_2';
freeText.getStatus = () => null;
freeText.TextColor = new window.Core.Annotations.Color(0, 255, 0);

distanceMeasurement = new window.Core.Annotations.LineAnnotation();
distanceMeasurement.IT = 'LineDimension';
distanceMeasurement.getStatus = () => null;
distanceMeasurement.StrokeColor = new window.Core.Annotations.Color(255, 0, 0);
distanceMeasurement.Measure = {};

const chromaticModes = {
  'Light theme': allModes.light,
  'Dark theme': {
    ...allModes.dark,
    a11y: { manual: true }
  },
  'Light theme RTL': {
    ...allModes['light-RTL'],
    a11y: { manual: true },
  },
};

// There is a helper getAppRect that uses this to check if we are in storybook. We should refactor this to not 
// have this dependency
window.storybook = {};
export default {
  parameters: {
    viewport: {
      options: storybookViewports,
    },
    chromatic: {
      modes: chromaticModes
    }
  },
  decorators: [
    viewerMockToggleDecorator,
    setThemeDecorator,
    withThemeByClassName({
      themes: {
        light: Theme.LIGHT,
        dark: Theme.DARK,
      },
      defaultTheme: Theme.LIGHT,
    }),
    I18nDecorator
  ]
};
