import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { within, userEvent, expect, fn } from 'storybook/test';
import initialState from 'src/redux/initialState';
import { BASIC_PALETTE, COLOR_PALETTE_STYLES } from 'src/constants/commonColors';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import ColorPicker from './ColorPicker';

const fillColors = BASIC_PALETTE.slice(0, 8).map((color) => color.toLowerCase());
const customFillColors = BASIC_PALETTE.slice(12, 14).map((color) => color.toLowerCase());
const firstFillColorHex = BASIC_PALETTE[0].toUpperCase();
const escapedFirstFillColorHex = firstFillColorHex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const firstFillColorHexRegex = new RegExp(escapedFirstFillColorHex, 'i');

const buildStore = () => {
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      fillColors,
      customFillColors,
      toolColorOverrides: {},
    },
  };

  return configureStore({
    reducer: () => mockState,
  });
};

export default {
  title: 'Components/StylePicker/ColorPicker',
  component: ColorPicker,
};

const ColorPickerStory = (args) => {
  const store = buildStore();
  return (
    <Provider store={store}>
      <div className="StylePicker" style={{ width: '320px', padding: '12px' }}>
        <ColorPicker {...args} />
      </div>
    </Provider>
  );
};

export const Basic = ColorPickerStory.bind({});

Basic.args = {
  dataElement: 'storybookColorPicker',
  onColorChange: fn(),
  hasTransparentColor: true,
  type: COLOR_PALETTE_STYLES.FillColor.type,
  ariaTypeLabel: 'Fill color',
};


export const CallsOnColorChange = ColorPickerStory.bind({});

CallsOnColorChange.args = {
  ...Basic.args,
  onColorChange: fn(),
};

CallsOnColorChange.play = async ({ canvasElement, args }) => {
  const canvas = within(canvasElement);
  const swatchButton = canvas.getByRole('button', { name: firstFillColorHexRegex });

  await userEvent.click(swatchButton);

  await expect(args.onColorChange).toHaveBeenCalled();
  await expect(swatchButton).toHaveAttribute('aria-current', 'true');

  const swatchCircle = swatchButton.querySelector('svg circle');
  await expect(swatchCircle.getAttribute('fill')).toBe(fillColors[0]);
};

export const ShowMoreExpandsPalette = ColorPickerStory.bind({});

ShowMoreExpandsPalette.args = {
  ...Basic.args,
  hasTransparentColor: false,
};

ShowMoreExpandsPalette.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const swatchButtonsBefore = canvas.getAllByRole('button', { name: /#/i }).length;
  const showMoreButton = canvas.getByRole('button', { name: `Fill color ${getTranslatedText('action.showMoreColors')}` });

  await userEvent.click(showMoreButton);

  const swatchButtonsAfter = canvas.getAllByRole('button', { name: /#/i }).length;
  await expect(swatchButtonsAfter).toBeGreaterThan(swatchButtonsBefore);
};
