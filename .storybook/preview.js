import core from 'core'
import I18nDecorator from "./I18nDecorator";
import 'react-quill/dist/quill.snow.css';

import '../src/index.scss';
import '../src/components/App/App.scss';

// We add this class to the StoryBook root element to mimick how we have
// structured our classes in the UI, where everythign is wrapped by the App class.
// If this is not done we miss some styles, and the Stories will look a bit different.
document.getElementById('root').className = 'App';

function noop() { }

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
};

const mockAnnotationManager = {
  exportAnnotations: noop,
  redrawAnnotations: noop,
  getEditBoxManager: noop,
  getFormFieldCreationManager: noop,
  getDisplayAuthor: (userId) => userId,
  deselectAllAnnotations: noop,
  selectAnnotation: noop,
  jumpToAnnotation: noop,
  setAnnotationStyles: noop,
  updateAnnotationRichTextStyle: noop,
  getCurrentUser: noop,
};

const mockFormFieldCreationManager = {
  isInFormFieldCreationMode: () => false,
  startFormFieldCreationMode: noop,
  endFormFieldCreationMode: noop,
};

core.getTool = () => mockTool;
core.isFullPDFEnabled = () => { return false; };
core.addEventListener = () => { };
core.removeEventListener = () => { };
core.getFormFieldCreationManager = () => mockFormFieldCreationManager;

window.Core = {
  AnnotationManager: mockAnnotationManager,
  Tools: {
    ToolNames: {}
  },
  getHashParameter: () => false,
  SupportedFileFormats: {
    CLIENT: [],
  },
  isBlendModeSupported: () => true,
  FontStyles: { BOLD: 'BOLD', ITALIC: 'ITALIC', UNDERLINE: 'UNDERLINE' },
  getCanvasMultiplier: () => 1,
};

const DEFAULT_PAGE_HEIGHT = 792;
const DEFAULT_PAGE_WIDTH = 612;

window.documentViewer = {
  doc: {},
  getDocument: () => ({
    getPageInfo: () => ({
      width: DEFAULT_PAGE_HEIGHT,
      height: DEFAULT_PAGE_WIDTH
    }),
    getType: () => 'PDF',
    loadCanvas: noop,

  }),
  getPageCount: () => 9,
  getAnnotationManager: () => mockAnnotationManager,
  getAnnotationHistoryManager: () => ({}),
  getRotation: () => 0,
  clearSearchResults: noop,
  getTool: (toolName) => mockTool,
  setWatermark: noop,
  getPageHeight: () => DEFAULT_PAGE_HEIGHT,
  getPageWidth: () => DEFAULT_PAGE_WIDTH,
};



// For an example of how these mock classes are used refer to AnnotationStylePopupStories.js
// However, it is preferrable to mock your annotation objects directly in your stories. These mocks are largely
// to support stories for components that rely on code that is calling methods/objects from the window object.
// For an example of the preferred mocking method refer to RedactionPageGroup.stories.js
class MockAnnotation {
  isFormFieldPlaceholder = () => false;
}

class MockLineAnnotation {
  isFormFieldPlaceholder = () => false;
  getStartStyle = () => 'None';
  getEndStyle = () => 'None';
  getIntent = () => null;
  Opacity = 1;
  StrokeThickness = 1;
};

class MockFreeTextAnnotation {
  static Intent = {
    FreeText: 'FreeText',
  }
  getIntent = () => 'FreeText';
  getRichTextStyle = () => null;
  isFormFieldPlaceholder = () => false;
};

class MockRectangleAnnotation {
  isFormFieldPlaceholder = () => false;
}

window.Tools = {
  ToolNames: {}
};
window.Annotations = {
  Annotation: {
    MeasurementUnits: {},
  },
  FreeTextAnnotation: MockFreeTextAnnotation,
  FreeHandAnnotation: MockAnnotation,
  LineAnnotation: MockLineAnnotation,
  PolylineAnnotation: MockAnnotation,
  ArcAnnotation: MockAnnotation,
  PolygonAnnotation: MockAnnotation,
  EllipseAnnotation: MockAnnotation,
  StickyAnnotation: MockAnnotation,
  TextHighlightAnnotation: MockAnnotation,
  TextUnderlineAnnotation: MockAnnotation,
  TextSquigglyAnnotation: MockAnnotation,
  TextStrikeoutAnnotation: MockAnnotation,
  RedactionAnnotation: MockAnnotation,
  RectangleAnnotation: MockRectangleAnnotation,
  StampAnnotation: MockAnnotation,
  FileAttachmentAnnotation: MockAnnotation,
  SoundAnnotation: MockAnnotation,
  Model3DAnnotation: MockAnnotation,
  WidgetAnnotation: MockAnnotation,
  Link: MockAnnotation,
  CaretAnnotation: MockAnnotation,
  CustomAnnotation: MockAnnotation,
  SignatureWidgetAnnotation: MockAnnotation
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

Annotations.Color = (R = 255, G = 0, B = 0) => {
  const toHexString = () => { return colorToHexString({ R, G, B }); };
  return { R, G, B, toHexString };
};

export const decorators = [
  I18nDecorator,
];