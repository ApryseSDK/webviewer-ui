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

Basic.parameters = window.storybook.disableRtlMode;

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

DisabledInTable.parameters = window.storybook.disableRtlMode;

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

DisabledInHeader.parameters = window.storybook.disableRtlMode;