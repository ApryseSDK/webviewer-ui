import React from 'react';
import rootReducer from 'reducers/rootReducer';
import OfficeEditorColumnsModal from './OfficeEditorColumnsModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userEvent, within, expect, waitFor } from 'storybook/test';
import { convertMeasurementUnit } from 'helpers/officeEditor';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

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
  return new Array(numberOfColums).fill().map((_, i) => {
    const columnWidthLabel = `${getTranslatedText('officeEditor.column')} ${i + 1} ${getTranslatedText('officeEditor.columnsModal.width')}`;
    const columnSpacingLabel = `${getTranslatedText('officeEditor.column')} ${i + 1} ${getTranslatedText('officeEditor.columnsModal.spacing')}`;
    return {
      label: columnWidthLabel,
      width: canvas.getByLabelText(columnWidthLabel),
      spacing: (i < numberOfColums - 1) ? canvas.getByLabelText(columnSpacingLabel) : { value: '0' }
    };
  });
};

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const columnAmountInput = canvas.getByLabelText(getTranslatedText('officeEditor.columnsModal.columnAmount'));

  // allow to clear input or type 0
  await userEvent.type(columnAmountInput, '{backspace}');
  expect(columnAmountInput.value).toBe('');
  await userEvent.type(columnAmountInput, '0');
  expect(columnAmountInput.value).toBe('0');

  // correct negative input to 1
  await userEvent.type(columnAmountInput, '{backspace}-9');
  expect(columnAmountInput.value).toBe('1');

  // once set to 5 columns, if cleared, blur away should reset to 5
  await userEvent.type(columnAmountInput, '{backspace}5{backspace}{tab}');
  expect(columnAmountInput.value).toBe('5');

  // once set to 5 columns, if type 0, blur away should reset to 5
  await userEvent.type(columnAmountInput, '{backspace}0{tab}');
  expect(columnAmountInput.value).toBe('5');
};

export const ColumnCalculation = () => <Basic />;

ColumnCalculation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const columnAmountInput = canvas.getByLabelText(getTranslatedText('officeEditor.columnsModal.columnAmount'));
  const equalWidthCheckbox = canvas.getByLabelText(getTranslatedText('officeEditor.columnsModal.equalColumns'));

  await userEvent.click(equalWidthCheckbox);
  expect(equalWidthCheckbox.checked).toBe(false);

  // Confirm available page width
  const columnLabel = `${getTranslatedText('officeEditor.column')} 1 ${getTranslatedText('officeEditor.columnsModal.width')}`;
  await waitFor(() => expect(canvas.getByLabelText(columnLabel).valueAsNumber).toBe(SINGLE_COLUMN_WIDTH_CM));

  await userEvent.type(columnAmountInput, '{backspace}5');
  expect(columnAmountInput.value).toBe('5');

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

  await userEvent.type(columnAmountInput, '{backspace}1');
  expect(canvas.getByLabelText(columnLabel).valueAsNumber).toBe(SINGLE_COLUMN_WIDTH_CM);
};

export const UnitConversion = () => <Basic />;

UnitConversion.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const singleColumnWidthInch = convertMeasurementUnit(SINGLE_COLUMN_WIDTH_CM, 'cm', 'inch');

  const unitButton = await canvas.findByRole('combobox', { name: getTranslatedText('officeEditor.unitMeasurement') });
  await userEvent.click(unitButton);
  const inchOption = canvas.getByRole('option', { name: 'inch' });
  await userEvent.click(inchOption);

  const columnLabel = `${getTranslatedText('officeEditor.column')} 1 ${getTranslatedText('officeEditor.columnsModal.width')}`;
  await waitFor(() => expect(canvas.getByLabelText(columnLabel).valueAsNumber).toBeCloseTo(singleColumnWidthInch, 1));

  const columnAmountInput = canvas.getByLabelText(getTranslatedText('officeEditor.columnsModal.columnAmount'));
  columnAmountInput.focus();
  columnAmountInput.value = '';
  await userEvent.type(columnAmountInput, '3[Tab]');

  const inputs = getColumnInputs(canvas, 3);
  await waitFor(() => expect(inputs.reduce((acc, input) => acc + parseFloat(input.width.value) + parseFloat(input.spacing.value), 0)).toBeCloseTo(singleColumnWidthInch, 1));
};