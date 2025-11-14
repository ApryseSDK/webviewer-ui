import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { userEvent, within, expect } from 'storybook/test';
import { OEModularUIMockState } from 'helpers/storybookHelper';
import OfficeEditorMarginDropdown from './OfficeEditorMarginDropdown';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/OfficeEditor/OfficeEditorMarginDropdown',
  component: OfficeEditorMarginDropdown,
};

const initialState = OEModularUIMockState;

export const Basic = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex' }}>
        <OfficeEditorMarginDropdown />
      </div>
    </Provider>
  );
};

Basic.parameters = window.storybook.disableRtlMode;

export const Expanded = () => <Basic />;
Expanded.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const marginButton = canvas.getByRole('button', { name: getTranslatedText('officeEditor.margins') });
  await userEvent.click(marginButton);
  await expect(marginButton).toHaveAttribute('aria-expanded', 'true');
  const normalOption = canvas.getByRole('option', { name: new RegExp(getTranslatedText('officeEditor.normal')) });
  await expect(normalOption).toHaveAttribute('aria-selected', 'true');
};

export const InInch = () => {
  initialState.officeEditor.unitMeasurement = 'inch';
  return <Basic />;
};
InInch.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: getTranslatedText('officeEditor.margins') }));
};

export const InMM = () => {
  initialState.officeEditor.unitMeasurement = 'mm';
  return <Basic />;
};
InMM.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: getTranslatedText('officeEditor.margins') }));
};