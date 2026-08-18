import core from 'core';
import { getOfficeEditorCursorProperties, getOfficeEditorSelectionProperties } from './exposedSelectors';
import { convertCoreHighlightColor } from 'helpers/officeEditor';
import { getActiveHighlightColor } from './officeEditorSelectors';

jest.mock('core', () => ({
  getOfficeEditor: jest.fn(),
}));

jest.mock('./exposedSelectors', () => ({
  getOfficeEditorCursorProperties: jest.fn(),
  getOfficeEditorSelectionProperties: jest.fn(),
}));

jest.mock('helpers/officeEditor', () => ({
  calculateLineSpacing: jest.fn(),
  convertCursorToStylePreset: jest.fn(),
  convertCoreTextColor: jest.fn(),
  convertCoreHighlightColor: jest.fn((color) => color),
}));

describe('getActiveHighlightColor', () => {
  const highlightColor = { r: 4, g: 5, b: 6, a: 1 };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when the office editor is not ready', () => {
    const state = { viewer: { isOfficeEditorMode: false } };
    expect(getActiveHighlightColor(state)).toBeNull();
  });

  it('should read textBackgroundColor from the active source and return the converted color', () => {
    const state = { viewer: { isOfficeEditorMode: true } };
    core.getOfficeEditor.mockReturnValue({ isTextSelected: () => true });
    getOfficeEditorSelectionProperties.mockReturnValue({ textBackgroundColor: highlightColor });
    getOfficeEditorCursorProperties.mockReturnValue({ textBackgroundColor: undefined });
    expect(getActiveHighlightColor(state)).toBe(highlightColor);
  });

  it('should return null when there is no highlight on initial load', () => {
    const state = { viewer: { isOfficeEditorMode: true } };
    convertCoreHighlightColor.mockReturnValueOnce(null);
    getOfficeEditorCursorProperties.mockReturnValue({ textBackgroundColor: { r: 0, g: 0, b: 0, a: 0 } });
    expect(getActiveHighlightColor(state)).toBeNull();
  });
});
