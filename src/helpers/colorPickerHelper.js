import React from 'react';
import classNames from 'classnames';
import selectors from 'selectors';
import actions from 'actions';
import { hexToRGBA } from './color';

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

export const getColorFromHex = (color) => {
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