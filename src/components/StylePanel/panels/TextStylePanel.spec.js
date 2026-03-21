import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import TextStylePanel from './TextStylePanel';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import useCore from 'hooks/useCore';

jest.mock('core', () => {
  return {
    getTool: jest.fn(),
    getDocument: jest.fn(),
    isFullPDFEnabled: jest.fn(),
    getFormFieldCreationManager: () => ({
      isInFormFieldCreationMode: () => false,
    })
  };
});

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('TextStylePanel', () => {
  const originalWindowCore = window.Core;
  let mockCore;

  beforeEach(() => {
    mockCore = {
      addEventListener: jest.fn(),
      removeEventListener: () => {},
      getDocument: () => {},
      getContentEditManager: () => ({
        isInContentEditMode: () => false,
      }),
      getAnnotationManager: () => ({
        getEditBoxManager: () => ({
          focusBox: jest.fn(),
          resizeAnnotation: jest.fn(),
        }),
      }),
    };
    useCore.mockReturnValue({
      core: mockCore,
      documentViewer: {},
    });
  });

  afterEach(() => {
    window.Core = originalWindowCore;
    mockCore = null;
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const selectedAnnotations = [{ id: 'annotation1' }, { id: 'annotation2' }];
    const currentTool = {
      name: 'AnnotationCreateFreeText',
    };
    const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
    });
    render(
      <Provider store={store}>
        <TextStylePanel selectedAnnotations={selectedAnnotations} currentTool={currentTool} />
      </Provider>
    );
  });

  it('passes text style props into the RichTextStyleEditor', () => {
    // Font styles and color that should override the defaults
    const fontFamily = 'Times New Roman';
    const fontSize = 7;
    // eslint-disable-next-line custom/no-hex-colors
    const color = '#272727';

    // Create an annotation with the above font styles and color
    // First, mock the necessary Core methods to return this annotation when the editorFocus event is triggered
    window.Core = {
      Annotations: {
        FreeTextAnnotation: class FreeTextAnnotation {
          getContentEditAnnotationId() {}
        },
        Color: class Color {
          constructor(value) {
            this.value = value;
          }
          toHexString() {
            return this.value;
          }
        },
      },
      Tools: { ToolNames: { ADD_PARAGRAPH: 'ADD_PARAGRAPH' } },
    };

    const annotation = new window.Core.Annotations.FreeTextAnnotation();
    annotation.ToolName = 'AnnotationCreateFreeText';
    annotation.Font = fontFamily;
    annotation.FontSize = fontSize;
    annotation.Color = color;
    annotation.getCalculatedFontSize = () => `${fontSize}pt`;
    annotation.getRichTextStyle = () => ({ 0: { 'font-size': `${fontSize}pt`, 'font-family': fontFamily } });
    annotation.isContentEditPlaceholder = () => false;
    const selectedAnnotations = [annotation];
    const currentTool = { name: 'AnnotationCreateFreeText' };

    // Render the panel
    const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
    });
    const { container, getByRole } = render(
      <Provider store={store}>
        <TextStylePanel selectedAnnotations={selectedAnnotations} currentTool={currentTool} />
      </Provider>
    );

    // Simulate editor focus to set up the editor and annotation
    jest.useFakeTimers();
    const editor = {
      getSelection: () => ({ index: 0, length: 0 }),
      getFormat: () => ({
        originalSize: `${fontSize}pt`,
        size: `${fontSize}pt`,
        font: fontFamily,
        color: color,
      }),
    };
    const editorFocusCallbacks = mockCore.addEventListener.mock.calls.filter((call) => call[0] === 'editorFocus');
    for (const editorFocusCallback of editorFocusCallbacks) {
      editorFocusCallback[1](editor, annotation);
    }
    act(() => {
      // Fast-forward until useOnFreeTextEdit timer has been executed
      jest.runOnlyPendingTimers();
    });

    // Check that the RichTextStyleEditor received the correct props
    const richTextStyleEditor = container.querySelector('.RichTextStyleEditor');
    expect(richTextStyleEditor).toBeInTheDocument();

    const fontFamilyCombobox = getByRole('combobox', { name: 'Font Family' });
    expect(fontFamilyCombobox).toHaveTextContent(annotation.Font);

    const fontSizeCombobox = getByRole('combobox', { name: 'Font Size' });
    expect(fontSizeCombobox).toHaveTextContent(String(annotation.FontSize));

    const colorButton = getByRole('button', { name: `Text Style Color ${annotation.Color}` });
    expect(colorButton).toHaveAttribute('aria-current', 'true');

    // eslint-disable-next-line custom/no-hex-colors
    const inactiveColorButton = getByRole('button', { name: 'Text Style Color #000000' });
    expect(inactiveColorButton).toHaveAttribute('aria-current', 'false');
  });
});
