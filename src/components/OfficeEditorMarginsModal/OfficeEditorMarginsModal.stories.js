import React from 'react';
import rootReducer from 'reducers/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userEvent, within, expect, waitFor } from 'storybook/test';
import OfficeEditorMarginsModal from './OfficeEditorMarginsModal';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'Components/OfficeEditorMarginsModal',
  component: OfficeEditorMarginsModal,
};

const store = configureStore({ reducer: rootReducer });

const getMarginInputs = (canvas, labels) => ({
  left:   { element: canvas.getByLabelText(labels.left,   { exact: false }) },
  right:  { element: canvas.getByLabelText(labels.right,  { exact: false }) },
  top:    { element: canvas.getByLabelText(labels.top,    { exact: false }) },
  bottom: { element: canvas.getByLabelText(labels.bottom, { exact: false }) },
});

export function Basic() {
  return (
    <Provider store={store}>
      <OfficeEditorMarginsModal />
    </Provider>
  );
}

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const labels = {
    left:   getTranslatedText('officeEditor.marginsModal.leftMargin'),
    right:  getTranslatedText('officeEditor.marginsModal.rightMargin'),
    top:    getTranslatedText('officeEditor.marginsModal.topMargin'),
    bottom: getTranslatedText('officeEditor.marginsModal.bottomMargin'),
  };

  const inputs = getMarginInputs(canvas, labels);
  const maxValuesCM = { left: '12.38', right: '2.54', top: '8.38', bottom: '8.38' };

  for (const [side, { element: input }] of Object.entries(inputs)) {
    await waitFor(() => expect(input.value).toBe('2.54'));

    // lower bound
    await userEvent.clear(input);
    await userEvent.type(input, '-9[Tab]');
    expect(input.value).toBe('0');

    // upper bound
    await userEvent.clear(input);
    await userEvent.type(input, '999[Tab]');
    expect(input.value).toBe(maxValuesCM[side]);
  }

  // Left/Right combined constraint
  await userEvent.clear(inputs.left.element);
  await userEvent.type(inputs.left.element, '5[Tab]');
  await userEvent.clear(inputs.right.element);
  await userEvent.type(inputs.right.element, '999[Tab]');
  expect(inputs.right.element.value).toBe('9.92');
};

export const UnitConversion = () => <Basic />;

UnitConversion.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const labels = {
    left:   getTranslatedText('officeEditor.marginsModal.leftMargin'),
    right:  getTranslatedText('officeEditor.marginsModal.rightMargin'),
    top:    getTranslatedText('officeEditor.marginsModal.topMargin'),
    bottom: getTranslatedText('officeEditor.marginsModal.bottomMargin'),
  };

  const inputs = getMarginInputs(canvas, labels);

  // switch to mm
  const unitButton = await canvas.findByRole(
    'combobox',
    { name: getTranslatedText('officeEditor.unitMeasurement') }
  );
  await userEvent.click(unitButton);
  await userEvent.click(canvas.getByRole('option', { name: 'mm' }));

  for (const { element: input } of Object.values(inputs)) {
    expect(input.value).toBe('25.4');
  }

  // bounds in mm
  await userEvent.clear(inputs.left.element);
  await userEvent.type(inputs.left.element, '-0[Tab]');
  expect(inputs.left.element.value).toBe('0');

  await userEvent.clear(inputs.right.element);
  await userEvent.type(inputs.right.element, '999[Tab]');
  expect(inputs.right.element.value).toBe('149.22');

  // switch to inch
  await userEvent.click(unitButton);
  await userEvent.click(canvas.getByRole('option', { name: 'inch' }));

  const valuesINCH = { left: '0', right: '5.87', top: '1', bottom: '1' };
  for (const [side, { element: input }] of Object.entries(inputs)) {
    expect(input.value).toBe(valuesINCH[side]);
  }

  await userEvent.type(inputs.left.element, '999[Tab]');
  expect(inputs.left.element.value).toBe('0');
};