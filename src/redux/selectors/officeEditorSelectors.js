import core from 'core';
import { getOfficeEditorCursorProperties, getOfficeEditorSelectionProperties } from './exposedSelectors';
import { DEFAULT_COLOR, DEFAULT_POINT_SIZE } from 'constants/officeEditor';
import { calculateLineSpacing, convertCursorToStylePreset, convertCoreTextColor, convertCoreHighlightColor } from 'helpers/officeEditor';

const isOfficeEditorReady = (state) => {
  return getIsOfficeEditorMode(state) && core.getOfficeEditor();
};

const isStyleButtonActive = (state, styleType) => {
  if (!styleType || !isOfficeEditorReady(state)) {
    return false;
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const isActive = styleType === 'underline' ?
    properties.underlineStyle === 'single' :
    properties[styleType];
  return isActive;
};

const getPointSizeSelectionKey = (state) => {
  if (!isOfficeEditorReady(state)) {
    return '';
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const pointSize = properties.pointSize;
  const pointSizeSelectionKey = pointSize === undefined ? '' : pointSize.toString();
  return pointSizeSelectionKey;
};

const getCursorStyleToPreset = (state) => {
  if (!isOfficeEditorReady(state)) {
    return '';
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;

  return convertCursorToStylePreset(properties);
};

const getCurrentFontFace = (state) => {
  if (!isOfficeEditorReady(state)) {
    return '';
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const fontFace = properties.fontFace || '';
  return fontFace;
};

const getActiveListType = (state) => {
  if (!isOfficeEditorReady(state)) {
    return false;
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const activeListType = properties.paragraphProperties.listType;
  return activeListType;
};

const getLineSpacing = (state) => {
  if (!isOfficeEditorReady(state)) {
    return '';
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const lineHeight = properties.paragraphProperties.lineHeight;
  const lineHeightMultiplier = properties.paragraphProperties.lineHeightMultiplier;
  const fontSize = cursorProperties.paragraphProperties.fontPointSize || DEFAULT_POINT_SIZE;

  return calculateLineSpacing(lineHeightMultiplier, lineHeight, fontSize);
};

const isJustificationButtonActive = (state, justificationType) => {
  if (!justificationType || !isOfficeEditorReady(state)) {
    return false;
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const isActive = properties.paragraphProperties.justification === justificationType;
  return isActive;
};

const getActiveHighlightColor = (state) => {
  if (!isOfficeEditorReady(state)) {
    return null;
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const highlightColor = convertCoreHighlightColor(properties.textBackgroundColor);
  return highlightColor;
};

const getActiveColor = (state) => {
  if (!isOfficeEditorReady(state)) {
    return DEFAULT_COLOR;
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const color = convertCoreTextColor(properties.color);
  return color;
};

const getIsOfficeEditorMode = (state) => state.viewer.isOfficeEditorMode;

const isNonPrintingCharactersEnabled = (state) => {
  if (!isOfficeEditorReady(state)) {
    return false;
  }
  return core.getOfficeEditor().getIsNonPrintingCharactersEnabled();
};

const isOfficeEditorUndoEnabled = (state) => state.officeEditor.canUndo;

const isOfficeEditorRedoEnabled = (state) => state.officeEditor.canRedo;

const getOfficeEditorIsReplaceInProgress = (state) => state.officeEditor.isReplaceInProgress;

export {
  isStyleButtonActive,
  getPointSizeSelectionKey,
  getCursorStyleToPreset,
  getCurrentFontFace,
  getLineSpacing,
  getActiveColor,
  getActiveHighlightColor,
  getActiveListType,
  getIsOfficeEditorMode,
  isJustificationButtonActive,
  isNonPrintingCharactersEnabled,
  isOfficeEditorUndoEnabled,
  isOfficeEditorRedoEnabled,
  getOfficeEditorIsReplaceInProgress,
};