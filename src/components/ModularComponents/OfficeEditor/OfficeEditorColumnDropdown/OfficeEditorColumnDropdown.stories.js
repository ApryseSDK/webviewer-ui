import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { userEvent, within, expect } from 'storybook/test';
import { OEModularUIMockState } from 'helpers/storybookHelper';
import DataElements from 'constants/dataElement';
import OfficeEditorColumnDropdown from './OfficeEditorColumnDropdown';
import WarningModal from 'src/components/WarningModal';

export default {
  title: 'ModularComponents/OfficeEditor/OfficeEditorColumnDropdown',
  component: OfficeEditorColumnDropdown,
};

const initialState = OEModularUIMockState;

export const Basic = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex' }}>
        <OfficeEditorColumnDropdown />
      </div>
    </Provider>
  );
};

export const Expanded = () => <Basic />;
Expanded.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const columnButton = await canvas.findByRole('button', { name: 'Columns' });
  await userEvent.click(columnButton);
  await expect(columnButton).toHaveAttribute('aria-expanded', 'true');
};

export const ColumnsWarningModal = () => {
  const warning = {
    title: 'warning.officeEditorPageLayout.title',
    message: 'warning.officeEditorPageLayout.columnsMessage',
  };
  const initialState = {
    ...OEModularUIMockState,
    viewer: {
      ...OEModularUIMockState.viewer,
      openElements: {
        [DataElements.WARNING_MODAL]: true,
      },
      warning,
    },
  };
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <WarningModal />
      <div style={{ display: 'flex' }}>
        <OfficeEditorColumnDropdown />
      </div>
    </Provider>
  );
};