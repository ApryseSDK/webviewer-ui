import React from 'react';
import rootReducer from 'reducers/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userEvent, within, expect, waitFor } from 'storybook/test';
import { MARGIN_SIDES } from 'constants/officeEditor';
import OfficeEditorMarginsModal from './OfficeEditorMarginsModal';

export default {
  title: 'Components/OfficeEditorMarginsModal',
  component: OfficeEditorMarginsModal,
};

const store = configureStore({ reducer: rootReducer });

const SIDES = Object.values(MARGIN_SIDES);
const getMarginInputs = (canvas) => SIDES.reduce((acc, side) => {
  acc[side] = {
    element: canvas.getByLabelText(`${side} Margin`, { exact: false }),
  };
  return acc;
}, {});

export function Basic() {
  return (
    <Provider store={store}>
      <OfficeEditorMarginsModal />
    </Provider>
  );
}

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const inputs = getMarginInputs(canvas);
  const maxValuesCM = { left: '12.38', right: '2.54', top: '8.38', bottom: '8.38' };

  for (const [side, inputObj] of Object.entries(inputs)) {
    const input = inputObj.element;
    await waitFor(() => expect(input.value).toBe('2.54'));

    // Test lower limit of input
    await userEvent.clear(input);
    await userEvent.type(input, '-9[Tab]');
    expect(input.value).toBe('0');

    // Test upper limit of input.
    await userEvent.clear(input);
    await userEvent.type(input, '999[Tab]');
    expect(input.value).toBe(maxValuesCM[side]);
  }

  // Change Left Margin's input value and check if Right Margin's maximum value updates correctly
  // Left and Right Margin combined value must be less than or equal to 14.92 (Leaving 1.27cm or 0.5in for content)
  await userEvent.clear(inputs.left.element);
  await userEvent.type(inputs.left.element, '5[Tab]');
  await userEvent.clear(inputs.right.element);
  await userEvent.type(inputs.right.element, '999[Tab]');
  expect(inputs.right.element.value).toBe('9.92');
};

export const UnitConversion = () => <Basic />;

UnitConversion.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const inputs = getMarginInputs(canvas);

  // Test conversion of input values to mm
  const unitButton = await canvas.findByRole('combobox', { name: 'Unit Measurement' });
  await userEvent.click(unitButton);
  const mmOption = canvas.getByRole('option', { name: 'mm' });
  await userEvent.click(mmOption);

  for (const inputObj of Object.values(inputs)) {
    const input = inputObj.element;
    expect(input.value).toBe('25.4');
  }

  // Test lower and upper limit of inputs in mm
  await userEvent.clear(inputs.left.element);
  await userEvent.type(inputs.left.element, '-0[Tab]');
  expect(inputs.left.element.value).toBe('0');
  await userEvent.clear(inputs.right.element);
  await userEvent.type(inputs.right.element, '999[Tab]');
  expect(inputs.right.element.value).toBe('149.22');

  // Test conversion of input values to inch
  const valuesINCH = { left: '0', right: '5.87', top: '1', bottom: '1' };
  await userEvent.click(unitButton);
  const inchOption = canvas.getByRole('option', { name: 'inch' });
  await userEvent.click(inchOption);

  for (const [side, inputObj] of Object.entries(inputs)) {
    const input = inputObj.element;
    expect(input.value).toBe(valuesINCH[side]);
  }

  await userEvent.type(inputs.left.element, '999[Tab]');
  expect(inputs.left.element.value).toBe('0');
};