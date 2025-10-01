import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import StylePickerComponent from './StylePicker';
import { within, userEvent, expect } from 'storybook/test';

export default {
  title: 'ModularComponents/StylePicker',
  component: StylePickerComponent,
};

const store = configureStore({
  reducer: rootReducer,
});

const style = {
  Opacity: 1,
  StrokeThickness: 1,
  Scale: [
    [1, 'in'],
    [1, 'in']
  ],
  Precision: 0.1,
};

export const StylePicker = () => {
  const props = {
    style: style,
    sliderProperties: ['Opacity', 'StrokeThickness'],
    showLineStyleOptions: true,
    startLineStyle: 'None',
    endLineStyle: 'None',
    strokeStyle: 'solid',
    onStyleChange: () => { },
  };
  return (
    <Provider store={store}>
      <div style={{ width: '310px', padding: '16px' }}>
        <StylePickerComponent {...props} />
      </div>
    </Provider>
  );
};

StylePicker.parameters = window.storybook.disableRtlMode;

export const NoNegativeValuesInStyleSliders = StylePicker.bind({});

NoNegativeValuesInStyleSliders.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const strokeThicknessInput = await canvas.findByRole('textbox', { name: /Stroke/ });
  const opacityInput = await canvas.findByRole('textbox', { name: /Opacity/ });

  await userEvent.click(strokeThicknessInput);
  await userEvent.type(strokeThicknessInput, '{selectall}{backspace}-15');

  await userEvent.click(opacityInput);
  await userEvent.type(opacityInput, '{backspace}{backspace}{backspace}{backspace}-15');

  await userEvent.click(canvasElement);

  const updatedStrokeInput = await canvas.findByRole('textbox', { name: /Stroke/ });
  expect(updatedStrokeInput.value).toBe('0.10pt');
  const updatedOpacityInput = await canvas.findByRole('textbox', { name: /Opacity/ });
  expect(updatedOpacityInput.value).toBe('0%');
};

NoNegativeValuesInStyleSliders.parameters = window.storybook.disableRtlMode;