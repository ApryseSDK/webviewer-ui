import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import useCore from 'hooks/useCore';
import core from 'core';
import * as getRootNodeModule from 'src/helpers/getRootNode';
import handleSelectionChange from './TextEditingPanelHelpers/handleSelectionChange';
import getFontInfo from './TextEditingPanelHelpers/getFontInfo';
import updateContentEditingFonts from './TextEditingPanelHelpers/updateContentEditingFonts';
import TextEditingPanelContainer from './TextEditingPanelContainer';
import applyPropertyChange from './TextEditingPanelHelpers/applyPropertyChange';

jest.mock('core');
jest.mock('hooks/useCore');

// eslint-disable-next-line custom/no-hex-colors
const testColorHex = '#FF0000';

describe('applyPropertyChange', () => {
  let instance;

  beforeEach(() => {
    instance = {
      Core: {
        ContentEdit: {
          alignContents: jest.fn(),
          setContentFont: jest.fn(),
          setContentFontSize: jest.fn(),
          setTextAttributes: jest.fn(),
        },
      },
    };
  });

  it('should only use the paragraph command for a selected content box alignment', () => {
    const selectedContentBox = {};

    applyPropertyChange({ instance, selectedContentBox, property: 'TextAlign', value: 'Center' });

    expect(instance.Core.ContentEdit.alignContents).toHaveBeenCalledWith(selectedContentBox, 'Center');
    expect(instance.Core.ContentEdit.setTextAttributes).not.toHaveBeenCalled();
  });

  it('should retain the generic text attribute fallback without a selected content box', () => {
    applyPropertyChange({ instance, selectedContentBox: null, property: 'TextAlign', value: 'Center' });

    expect(instance.Core.ContentEdit.alignContents).not.toHaveBeenCalled();
    expect(instance.Core.ContentEdit.setTextAttributes).toHaveBeenCalledWith({ textAlign: 'Center' });
  });

  it('should retain the generic text attribute update for font changes', () => {
    const selectedContentBox = {};

    applyPropertyChange({ instance, selectedContentBox, property: 'Font', value: 'Arial' });

    expect(instance.Core.ContentEdit.setContentFont).toHaveBeenCalledWith(selectedContentBox, 'Arial');
    expect(instance.Core.ContentEdit.setTextAttributes).toHaveBeenCalledWith({ fontName: 'Arial' });
  });

  it('should update the selected content box and generic text attributes for font size changes', () => {
    const selectedContentBox = {};

    applyPropertyChange({ instance, selectedContentBox, property: 'FontSize', value: '16' });

    expect(instance.Core.ContentEdit.setContentFontSize).toHaveBeenCalledWith(selectedContentBox, '16');
    expect(instance.Core.ContentEdit.setTextAttributes).toHaveBeenCalledWith({ fontSize: '16' });
  });

  it('should ignore unsupported properties', () => {
    applyPropertyChange({ instance, selectedContentBox: {}, property: 'UnsupportedProperty', value: 'value' });

    expect(instance.Core.ContentEdit.alignContents).not.toHaveBeenCalled();
    expect(instance.Core.ContentEdit.setContentFont).not.toHaveBeenCalled();
    expect(instance.Core.ContentEdit.setContentFontSize).not.toHaveBeenCalled();
    expect(instance.Core.ContentEdit.setTextAttributes).not.toHaveBeenCalled();
  });
});

describe('handleSelectionChange', () => {
  let mockContentEditorRef;
  let mockInstance;
  let mockSetSelectionMode;
  let mockSetFonts;
  let mockSetTextEditProperties;
  let mockSetFormat;
  let mockHandleColorChange;
  let mockGetFontName;

  beforeEach(() => {
    mockSetSelectionMode = jest.fn();
    mockSetFonts = jest.fn();
    mockSetTextEditProperties = jest.fn();
    mockSetFormat = jest.fn();
    mockHandleColorChange = jest.fn();
    mockGetFontName = jest.fn((fontName) => {
      if (typeof fontName !== 'string') {
        return '';
      }
      return fontName.replace(/(Bold|Italic)/gi, '').trim();
    });

    mockContentEditorRef = {
      current: {
        getTextAttributes: jest.fn().mockResolvedValue({
          fontColor: testColorHex,
          fontSize: 12,
          fontName: 'Arial',
          textAlign: 'left',
          bold: false,
          italic: false,
          underline: false,
        }),
        getCachedTextAttributes: jest.fn().mockReturnValue(null),
      },
    };

    mockInstance = {
      Core: {
        Annotations: {
          Color: jest.fn((color) => ({ toHexString: () => color })),
        },
        ContentEdit: {
          Types: {
            TEXT: 'text',
            OBJECT: 'object',
          },
        },
      },
    };
  });

  it('should call setSelectionMode with TEXT type when in content edit mode', async () => {
    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: [],
      instance: mockInstance,
    });

    expect(mockSetSelectionMode).toHaveBeenCalledWith('text');
  });

  it('should not call setSelectionMode when not in content edit mode', async () => {
    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: false,
      fonts: [],
      instance: mockInstance,
    });

    expect(mockSetSelectionMode).not.toHaveBeenCalled();
  });

  it('should set text properties and format before calling setSelectionMode', async () => {
    const callOrder = [];
    mockSetTextEditProperties.mockImplementation(() => callOrder.push('setTextEditProperties'));
    mockSetFormat.mockImplementation(() => callOrder.push('setFormat'));
    mockSetSelectionMode.mockImplementation(() => callOrder.push('setSelectionMode'));

    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: [],
      instance: mockInstance,
    });

    expect(callOrder).toEqual(['setTextEditProperties', 'setFormat', 'setSelectionMode']);
  });

  it('should call setFormat with correct attributes including color', async () => {
    const mockAttributes = {
      fontColor: testColorHex,
      fontSize: 16,
      fontName: 'Helvetica',
      textAlign: 'center',
      bold: true,
      italic: false,
      underline: true,
    };

    mockContentEditorRef.current.getTextAttributes.mockResolvedValue(mockAttributes);

    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: [],
      instance: mockInstance,
    });

    expect(mockSetFormat).toHaveBeenCalledWith({
      fontSize: 16,
      fontName: 'Helvetica',
      textAlign: 'center',
      bold: true,
      italic: false,
      underline: true,
      fontColor: testColorHex,
      color: expect.objectContaining({
        toHexString: expect.any(Function),
      }),
    });
  });

  it('should add new font to fonts array if not already included', async () => {
    mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
      fontColor: testColorHex,
      fontSize: 12,
      fontName: 'TimesNewRoman',
      textAlign: 'left',
    });

    mockGetFontName.mockReturnValue('Times New Roman');

    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: ['Arial', 'Helvetica'],
      instance: mockInstance,
    });

    expect(mockSetFonts).toHaveBeenCalledWith(['Arial', 'Helvetica', 'Times New Roman']);
  });

  it('should not add font if already in fonts array', async () => {
    mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
      fontColor: testColorHex,
      fontSize: 12,
      fontName: 'Arial',
      textAlign: 'left',
    });

    mockGetFontName.mockReturnValue('Arial');

    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: ['Arial', 'Helvetica'],
      instance: mockInstance,
    });

    expect(mockSetFonts).not.toHaveBeenCalled();
  });

  describe('getFontInfo', () => {
    it('should extract font object with FontSize, Font, and TextAlign', async () => {
      mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
        fontColor: testColorHex,
        fontSize: 14,
        fontName: 'Helvetica',
        textAlign: 'center',
        bold: true,
      });

      mockGetFontName.mockReturnValue('Helvetica');

      const result = await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(result.fontObject).toEqual({
        FontSize: 14,
        Font: 'Helvetica',
        TextAlign: 'center',
      });
    });

    it('should create Color instance with fontColor from attributes', async () => {
      // eslint-disable-next-line custom/no-hex-colors
      const customColor = '#00FF00';
      mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
        fontColor: customColor,
        fontSize: 12,
        fontName: 'Arial',
        textAlign: 'left',
      });

      mockGetFontName.mockReturnValue('Arial');

      const result = await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(mockInstance.Core.Annotations.Color).toHaveBeenCalledWith(customColor);
      expect(result.color).toBeDefined();
      expect(result.color.toHexString()).toBe(customColor);
    });

    it('should return attribute object with all text properties', async () => {
      const mockAttributes = {
        fontColor: testColorHex,
        fontSize: 18,
        fontName: 'Courier',
        textAlign: 'right',
        bold: true,
        italic: true,
        underline: false,
      };

      mockContentEditorRef.current.getTextAttributes.mockResolvedValue(mockAttributes);
      mockGetFontName.mockReturnValue('Courier');

      const result = await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(result.attribute).toEqual(mockAttributes);
    });

    it('should call getFontName with fontName from attributes', async () => {
      mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
        fontColor: testColorHex,
        fontSize: 12,
        fontName: 'ArialBoldItalic',
        textAlign: 'left',
      });

      mockGetFontName.mockReturnValue('Arial');

      await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(mockGetFontName).toHaveBeenCalledWith('ArialBoldItalic');
    });

    it('should return all three properties: fontObject, color, and attribute', async () => {
      mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
        fontColor: testColorHex,
        fontSize: 12,
        fontName: 'Arial',
        textAlign: 'left',
      });

      mockGetFontName.mockReturnValue('Arial');

      const result = await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(result).toHaveProperty('fontObject');
      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('attribute');
    });

    it('should handle different text alignment values', async () => {
      const alignments = ['left', 'center', 'right', 'justify'];

      for (const alignment of alignments) {
        mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
          fontColor: testColorHex,
          fontSize: 12,
          fontName: 'Arial',
          textAlign: alignment,
        });

        mockGetFontName.mockReturnValue('Arial');

        const result = await getFontInfo(
          mockInstance,
          mockContentEditorRef,
          mockGetFontName
        );

        expect(result.fontObject.TextAlign).toBe(alignment);
      }
    });

    it('should not crash when fontName is a non-string value', async () => {
      // Defensive regression test: getFontName must guard against any non-string
      // fontName (e.g. [], null, undefined) and return '' instead of crashing.
      mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
        fontColor: testColorHex,
        fontSize: 12,
        fontName: [],
        textAlign: 'left',
      });

      const result = await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(result.fontObject.Font).toBe('');
    });
  });
});

describe('updateContentEditingFonts', () => {
  it('should not throw and should default to an empty font list when getContentEditingFonts resolves null', async () => {
    const setFonts = jest.fn();
    const instance = {
      Core: {
        ContentEdit: {
          getContentEditingFonts: jest.fn().mockResolvedValue(null),
        },
      },
    };

    await expect(updateContentEditingFonts({ instance, setFonts })).resolves.toBeUndefined();

    expect(setFonts).toHaveBeenCalledTimes(1);
    const updaterFn = setFonts.mock.calls[0][0];
    expect(updaterFn(['Arial'])).toEqual(['Arial']);
  });

  it('should merge newly discovered fonts with the existing list, without duplicates', async () => {
    const setFonts = jest.fn();
    const instance = {
      Core: {
        ContentEdit: {
          getContentEditingFonts: jest.fn().mockResolvedValue(['Arial', 'Helvetica']),
        },
      },
    };

    await updateContentEditingFonts({ instance, setFonts });

    const updaterFn = setFonts.mock.calls[0][0];
    expect(updaterFn(['Arial'])).toEqual(['Arial', 'Helvetica']);
  });
});

describe('TextEditingPanelContainer', () => {
  let store;
  let mockGetContentBoxAttributes;
  let mockAddEventListener;
  let mockIsInContentEditMode;
  const originalWindowInstance = window.instance;
  const originalWindowCore = window.Core;

  function createMockAnnotation(contentBoxId = 'box-1') {
    return {
      isContentEditPlaceholder: () => true,
      getContentEditType: () => 'text',
      getCustomData: (key) => (key === 'contentEditBoxId' ? contentBoxId : undefined),
    };
  }

  // Selecting the annotation is how the panel normally learns which content box to show;
  // it exercises the same 'annotationSelected' listener the panel already relies on.
  // setContentEditPanelProperties is fire-and-forget from the listener's perspective, so
  // callers must waitFor the resulting attribute fetch rather than await this function.
  function selectAnnotation(annotation) {
    const handler = mockAddEventListener.mock.calls.find(([eventName]) => eventName === 'annotationSelected')[1];
    act(() => {
      handler([annotation], 'selected');
    });
  }

  function fireUndoRedoStatusChanged() {
    // The listener effect depends on selectedContentBox, so it re-subscribes with a fresh
    // closure each time a box is selected/deselected; always use the most recent registration.
    const calls = window.instance.Core.ContentEdit.addEventListener.mock.calls
      .filter(([eventName]) => eventName === 'undoRedoStatusChanged');
    const handler = calls[calls.length - 1][1];
    act(() => {
      handler();
    });
  }

  // Mirrors how the panel actually learns an editor session started, so contentEditorRef.current
  // becomes truthy the same way it would in the app.
  function fireContentBoxEditStarted(payload = { insertHyperlink: jest.fn() }) {
    const call = mockAddEventListener.mock.calls.find(([eventName]) => eventName === 'contentBoxEditStarted');
    if (!call) {
      throw new Error('contentBoxEditStarted listener was not registered');
    }
    const [, handler] = call;
    act(() => {
      handler(payload);
    });
  }

  beforeEach(() => {
    jest.spyOn(getRootNodeModule, 'getInstanceNode').mockReturnValue(globalThis);

    store = configureStore({
      reducer: rootReducer(),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
    });

    mockGetContentBoxAttributes = jest.fn().mockResolvedValue({
      fontName: 'Arial', fontSize: '12', textAlign: 'left', bold: false, italic: false, underline: false, strike: false, fontColors: [],
    });
    mockAddEventListener = jest.fn();
    mockIsInContentEditMode = jest.fn().mockReturnValue(true);

    // useOnContentEditHistoryUndoRedoChanged imports the `core` singleton directly (not via useCore).
    core.getDocumentViewer.mockReturnValue({
      getContentEditHistoryManager: () => ({ canUndo: () => false, canRedo: () => false }),
      getContentEditManager: () => ({ undo: jest.fn(), redo: jest.fn() }),
    });

    useCore.mockReturnValue({
      core: {
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn(),
        getContentEditManager: () => ({ isInContentEditMode: mockIsInContentEditMode }),
        getDocumentViewer: () => ({
          getContentEditManager: () => ({ getContentBoxAttributes: mockGetContentBoxAttributes }),
          getContentEditHistoryManager: () => ({ canUndo: () => false, canRedo: () => false }),
        }),
      },
    });

    window.Core = { ...(originalWindowCore ?? {}), ContentEdit: { addEventListener: jest.fn(), removeEventListener: jest.fn() } };
    window.instance = {
      Core: {
        Annotations: { Color: jest.fn((value) => ({ toHexString: () => value })) },
        ContentEdit: {
          Types: { TEXT: 'text', OBJECT: 'object' },
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          getContentEditingFonts: jest.fn().mockResolvedValue([]),
        },
      },
    };
  });

  afterEach(() => {
    window.instance = originalWindowInstance;
    window.Core = originalWindowCore;
    // clearAllMocks() only clears call history; it doesn't restore the spied implementation.
    getRootNodeModule.getInstanceNode.mockRestore();
    jest.clearAllMocks();
  });

  it('should re-fetch content box attributes when undo/redo status changes while a box is selected', async () => {
    render(
      <Provider store={store}>
        <TextEditingPanelContainer />
      </Provider>,
    );

    selectAnnotation(createMockAnnotation('box-1'));
    await waitFor(() => expect(mockGetContentBoxAttributes).toHaveBeenCalledTimes(1));
    expect(mockGetContentBoxAttributes).toHaveBeenCalledWith('box-1');

    fireUndoRedoStatusChanged();

    await waitFor(() => expect(mockGetContentBoxAttributes).toHaveBeenCalledTimes(2));
    expect(mockGetContentBoxAttributes).toHaveBeenLastCalledWith('box-1');
  });

  it('should not re-fetch attributes on undo/redo status changes when no box is selected', async () => {
    render(
      <Provider store={store}>
        <TextEditingPanelContainer />
      </Provider>,
    );

    fireUndoRedoStatusChanged();
    await act(async () => {});

    expect(mockGetContentBoxAttributes).not.toHaveBeenCalled();
  });

  it('should not re-fetch attributes on undo/redo status changes while a content box editor is actively open', async () => {
    render(
      <Provider store={store}>
        <TextEditingPanelContainer />
      </Provider>,
    );

    selectAnnotation(createMockAnnotation('box-1'));
    await waitFor(() => expect(mockGetContentBoxAttributes).toHaveBeenCalledTimes(1));

    fireContentBoxEditStarted();
    fireUndoRedoStatusChanged();
    await act(async () => {});

    expect(mockGetContentBoxAttributes).toHaveBeenCalledTimes(1);
  });

  it('should not re-fetch attributes on undo/redo status changes when not in content edit mode', async () => {
    render(
      <Provider store={store}>
        <TextEditingPanelContainer />
      </Provider>,
    );

    selectAnnotation(createMockAnnotation('box-1'));
    await waitFor(() => expect(mockGetContentBoxAttributes).toHaveBeenCalledTimes(1));

    mockIsInContentEditMode.mockReturnValue(false);
    fireUndoRedoStatusChanged();
    await act(async () => {});

    expect(mockGetContentBoxAttributes).toHaveBeenCalledTimes(1);
  });
});