import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OEModularUIMockState } from 'helpers/storybookHelper';
import OfficeEditorMarginDropdown from './OfficeEditorMarginDropdown';

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