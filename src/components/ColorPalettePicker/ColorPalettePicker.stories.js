import React from 'react';
import ColorPalettePicker from './ColorPalettePicker';
import { useTranslation } from 'react-i18next';

export default {
  title: 'Components/ColorPalettePicker',
  component: ColorPalettePicker,
};

export function Basic() {
  const [t] = useTranslation();
  const color = { R: 100, G: 0, B: 0, A: 1 };
  const customColors = ["#000000", "#ff1111", "#ffffff"];

  function noop() {}
 
  const props = {
    t,
    color,
    customColors,
    getHexColor: noop,
    findCustomColorsIndex: noop,
    setColorToBeDeleted: noop,
  };
  return (
    <div>
      <ColorPalettePicker {...props} />
    </div>
  );
}
