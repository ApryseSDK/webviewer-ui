import core from 'core';
import { getOfficeEditorCursorProperties, getOfficeEditorSelectionProperties } from './exposedSelectors';
import { DEFAULT_COLOR, DEFAULT_POINT_SIZE } from 'constants/officeEditor';
import { calculateLineSpacing, convertCursorToStylePreset, convertCoreColorToWebViewerColor } from 'helpers/officeEditor';

const isStyleButtonActive = (state, styleType) => {
  if (!core.getDocument() || !styleType || !getIsOfficeEditorMode(state)) {
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
  if (!core.getDocument() || !getIsOfficeEditorMode(state)) {
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
  if (!core.getDocument() || !getIsOfficeEditorMode(state)) {
    return '';
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;

  return convertCursorToStylePreset(properties);
};

const getCurrentFontFace = (state) => {
  if (!core.getDocument() || !getIsOfficeEditorMode(state)) {
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
  if (!core.getDocument() || !getIsOfficeEditorMode(state)) {
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
  if (!core.getDocument() || !getIsOfficeEditorMode(state)) {
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
  if (!core.getDocument() || !justificationType || !getIsOfficeEditorMode(state)) {
    return false;
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const isActive = properties.paragraphProperties.justification === justificationType;
  return isActive;
};

const getActiveColor = (state) => {
  if (!core.getDocument() || !getIsOfficeEditorMode(state)) {
    return DEFAULT_COLOR;
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const color = convertCoreColorToWebViewerColor(properties.color);
  return color;
};

const getIsOfficeEditorMode = (state) => state.viewer.isOfficeEditorMode;

const isNonPrintingCharactersEnabled = () => {
  return core.getDocument() && core.getDocument().getOfficeEditor().getIsNonPrintingCharactersEnabled();
};

export {
  isStyleButtonActive,
  getPointSizeSelectionKey,
  getCursorStyleToPreset,
  getCurrentFontFace,
  getLineSpacing,
  getActiveColor,
  getActiveListType,
  getIsOfficeEditorMode,
  isJustificationButtonActive,
  isNonPrintingCharactersEnabled,
};