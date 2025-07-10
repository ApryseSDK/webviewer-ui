import React from 'react';
import rootReducer from 'reducers/rootReducer';
import OfficeEditorColumnsModal from './OfficeEditorColumnsModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userEvent, within, expect, waitFor } from '@storybook/test';
import { convertMeasurementUnit } from 'helpers/officeEditor';

export default {
  title: 'Components/OfficeEditorColumnsModal',
  component: OfficeEditorColumnsModal,
};

const store = configureStore({ reducer: rootReducer });
const SINGLE_COLUMN_WIDTH_CM = 11.11; // in cm

export function Basic() {
  return (
    <Provider store={store}>
      <OfficeEditorColumnsModal />
    </Provider>
  );
}

const getColumnInputs = (canvas, numberOfColums) => {
  return new Array(numberOfColums).fill().map((_, i) => ({
    width: canvas.getByLabelText(`Column ${i + 1} Width`),
    spacing: (i < numberOfColums - 1) ? canvas.getByLabelText(`Column ${i + 1} Spacing`) : { value: '0' }
  }));
};

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const columnAmountInput = canvas.getByLabelText('Number of Columns');
  const equalWidthCheckbox = canvas.getByLabelText('Equal Column Width');

  await userEvent.click(equalWidthCheckbox);
  expect(equalWidthCheckbox.checked).toBe(false);

  // Confirm available page width
  await waitFor(() => expect(canvas.getByLabelText('Column 1 Width').valueAsNumber).toBe(SINGLE_COLUMN_WIDTH_CM));

  columnAmountInput.focus();
  columnAmountInput.value = ''; // Need to clear the input programatically to get around validation. Storybook's userEvent.clear doesn't work as expected here.
  await userEvent.type(columnAmountInput, '5[Tab]');

  const inputs = getColumnInputs(canvas, 5);

  const expectInputsToBeWithinLimits = async () => {
    // Using waitFor as calculations don't update instantly
    await waitFor(() => expect(inputs.reduce((acc, input) => acc + parseFloat(input.width.value) + parseFloat(input.spacing.value), 0)).toBeCloseTo(SINGLE_COLUMN_WIDTH_CM));
  };

  for (const input of inputs) {
    await userEvent.clear(input.width);
    await userEvent.type(input.width, '3[Tab]');
    await expectInputsToBeWithinLimits();
  }

  for (let i = 0; i < inputs.length - 1; i++) {
    await userEvent.clear(inputs[i].spacing);
    await userEvent.type(inputs[i].spacing, '0.5[Tab]');
    await expectInputsToBeWithinLimits();
  }

  await userEvent.clear(columnAmountInput);
  expect(canvas.getByLabelText('Column 1 Width').valueAsNumber).toBe(SINGLE_COLUMN_WIDTH_CM);
};

export const UnitConversion = () => <Basic />;

UnitConversion.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const singleColumnWidthInch = convertMeasurementUnit(SINGLE_COLUMN_WIDTH_CM, 'cm', 'inch');

  const unitButton = await canvas.findByRole('combobox', { name: 'Unit Measurement' });
  await userEvent.click(unitButton);
  const inchOption = canvas.getByRole('option', { name: 'inch' });
  await userEvent.click(inchOption);

  await waitFor(() => expect(canvas.getByLabelText('Column 1 Width').valueAsNumber).toBeCloseTo(singleColumnWidthInch, 1));

  const columnAmountInput = canvas.getByLabelText('Number of Columns');
  columnAmountInput.focus();
  columnAmountInput.value = '';
  await userEvent.type(columnAmountInput, '3[Tab]');

  const inputs = getColumnInputs(canvas, 3);
  await waitFor(() => expect(inputs.reduce((acc, input) => acc + parseFloat(input.width.value) + parseFloat(input.spacing.value), 0)).toBeCloseTo(singleColumnWidthInch, 1));
};