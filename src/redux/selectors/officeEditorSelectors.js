import core from 'core';
import { rgbaToHex } from 'src/helpers/color';
import { getOfficeEditorCursorProperties, getOfficeEditorSelectionProperties } from './exposedSelectors';

const isStyleButtonActive = (state, styleType) => {
  if (!core.getDocument()) {
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
  if (!core.getDocument()) {
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

const getCursorStyleToPreset = (state, AVAILABLE_STYLE_PRESET_MAP, COMMON_COLORS) => {
  if (!core.getDocument()) {
    return '';
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;

  const {
    pointSize,
    color: currentColor
  } = properties || {};

  const defaultStylePreset = 'Normal Text';
  if (!pointSize || !currentColor) {
    return defaultStylePreset;
  }

  const fontSize = `${pointSize}pt`;
  let color = COMMON_COLORS['black'];
  if (color) {
    color = rgbaToHex(
      currentColor.r,
      currentColor.g,
      currentColor.b
    ).slice(0, -2);
  }

  return Object.keys(AVAILABLE_STYLE_PRESET_MAP).find(
    (style) => AVAILABLE_STYLE_PRESET_MAP[style].fontSize === fontSize && AVAILABLE_STYLE_PRESET_MAP[style].color === color
  ) || defaultStylePreset;
};

const getCurrentFontFace = (state) => {
  if (!core.getDocument()) {
    return '';
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const fontFace = properties.fontFace || '';
  return fontFace;
};

const isListToggleActive = (state) => {
  if (!core.getDocument()) {
    return false;
  }
  const isTextSelected = core.getOfficeEditor().isTextSelected();

  const cursorProperties = getOfficeEditorCursorProperties(state);
  const selectionProperties = getOfficeEditorSelectionProperties(state);

  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const activeListType = properties.paragraphProperties.listType;
  return activeListType;
};

export {
  isStyleButtonActive,
  getPointSizeSelectionKey,
  getCursorStyleToPreset,
  getCurrentFontFace,
  isListToggleActive,
};