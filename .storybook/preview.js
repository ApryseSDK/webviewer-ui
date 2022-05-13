import core from 'core'
import I18nDecorator from "./I18nDecorator";

import '../src/index.scss';
import '../src/components/App/App.scss';

// We add this class to the StoryBook root element to mimick how we have
// structured our classes in the UI, where everythign is wrapped by the App class.
// If this is not done we miss some styles, and the Stories will look a bit different.
document.getElementById('root').className = 'App';

function noop() { }

core.getTool = () => { }
core.isFullPDFEnabled = () => { return false; };
core.addEventListener = () => { };
core.removeEventListener = () => { };

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
}

window.Core = {
  AnnotationManager: mockAnnotationManager,
  Tools: {
    ToolNames: {}
  },
  getHashParameter: () => false,
  SupportedFileFormats: {
    CLIENT: [],
  }
};

window.documentViewer = {
  doc: {},
  getDocument: () => ({
    getPageInfo: () => ({
      width: 612,
      height: 792
    }),
    getType: () => 'PDF',
  }),
  getPageCount: () => 9,
  getAnnotationManager: () => mockAnnotationManager,
  getAnnotationHistoryManager: () => ({}),
  getRotation: () => 0,
  clearSearchResults: noop,
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

Annotations.Color = (R = 255, G = 0, B = 0) => ({ R, G, B });

export const decorators = [
  I18nDecorator,
];