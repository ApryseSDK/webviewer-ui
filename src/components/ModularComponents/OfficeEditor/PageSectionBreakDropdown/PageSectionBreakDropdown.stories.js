import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PageSectionBreakDropdown from './PageSectionBreakDropdown';
import { OEModularUIMockState } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/OfficeEditor/PageSectionBreakDropdown',
  component: PageSectionBreakDropdown,
};

const initialState = OEModularUIMockState;

export const Basic = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex' }}>
        <PageSectionBreakDropdown />
      </div>
    </Provider>
  );
};

export const DisabledInTable = () => {
  initialState.officeEditor.cursorProperties.locationProperties.inTable = true;
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex' }}>
        <PageSectionBreakDropdown />
      </div>
    </Provider>
  );
};

export const DisabledInHeader = () => {
  initialState.officeEditor.stream = 'header';
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex' }}>
        <PageSectionBreakDropdown />
      </div>
    </Provider>
  );
};