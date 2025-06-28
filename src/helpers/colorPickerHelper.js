import React from 'react';
import classNames from 'classnames';
import selectors from 'selectors';
import actions from 'actions';
import { hexToRGBA } from './color';
import { defaultBackgroundColor } from './initialColorStates';

export const parseColor = (color) => {
  if (!color) {
    return color;
  }
  let parsedColor = color;
  if (parsedColor?.toHexString) {
    parsedColor = parsedColor.toHexString();
  }
  if (parsedColor?.toLowerCase) {
    parsedColor = parsedColor.toLowerCase();
  }

  return parsedColor;
};

export const isColorTransparent = (color) => {
  if (!color) {
    return false;
  }
  return color['A'] === 0;
};

export const getColorFromHex = (color) => {
  const isHexColorTransparent = color === defaultBackgroundColor;
  if (isHexColorTransparent) {
    return new window.Core.Annotations.Color(255, 255, 255, 0);
  }
  const isColorHexString = /^#?[0-9A-F]{6}$/i.test(color);
  if (isColorHexString) {
    const colorRGB = hexToRGBA(color);
    return new window.Core.Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
  }
  return color;
};

/* eslint-disable custom/no-hex-colors */
export const transparentIcon = (
  <svg
    width="100%"
    height="100%"
    className={classNames('transparent')}
  >
    <line stroke="#d82e28" x1="0" y1="100%" x2="100%" y2="0" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
/* eslint-enable custom/no-hex-colors */

export const getCustomColorAndRemove = (dispatch, store) => {
  const customColor = selectors.getCustomColor(store.getState());
  dispatch(actions.setCustomColor(null));
  return customColor;
};

/**
 * @ignore
 * Extracts a list of unique, non-null, non-undefined, lowercased border colors from an object representing active cell border styles.
 * @param {Object} activeCellBorderStyle An object where each key represents a border side (e.g., 'top', 'right', etc.), and each value is an object that may contain a `color` property (a string).
 * @returns {string[]} An array of unique, lowercased border color strings.
 * @example
 * const borderStyle = {
 *   top: { color: null },
 *   right: { color: '#ffffff' },
 *   bottom: { color: '#00000' },
 *   left: { color: #FFFFFF },
 * };
 * const uniqueColors = getUniqueBorderColors(borderStyle);
 * // Output: ['#000000', '#ffffff']
 */
export const getUniqueBorderColors = (activeCellBorderStyle) => {
  const colorHelperSet = new Set();
  const activeCellBorderColors = Object.values(activeCellBorderStyle).map((item)=> item?.color?.toLowerCase()).filter((color) => {
    if (!color) {
      return false;
    }
    if (colorHelperSet.has(color)) {
      return false;
    }
    colorHelperSet.add(color);
    return true;
  });
  return activeCellBorderColors;
};