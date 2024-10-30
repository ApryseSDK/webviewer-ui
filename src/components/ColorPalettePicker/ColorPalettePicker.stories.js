import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import ColorPalettePicker from './ColorPalettePicker';
import { useTranslation } from 'react-i18next';

export default {
  title: 'Components/ColorPalettePicker',
  component: ColorPalettePicker,
  parameters: {
    customizableUI: true
  }
};

const color = { R: 100, G: 0, B: 0, A: 1 };
// eslint-disable-next-line custom/no-hex-colors
const customColors = ['#000000', '#ff1111', '#ffffff'];

export function Basic() {
  const [t] = useTranslation();
  function noop() { }
  const props = {
    t,
    color,
    customColors,
    getHexColor: noop,
    findCustomColorsIndex: noop,
    setColorToBeDeleted: noop
  };
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <ColorPalettePicker {...props} />
    </Provider>
  );
}