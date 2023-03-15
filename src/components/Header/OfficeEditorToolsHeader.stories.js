import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import DataElement from 'constants/dataElement';
import OfficeEditorToolsHeader from './OfficeEditorToolsHeader';
import core from 'core';
import { workerTypes } from 'src/constants/types';

export default {
  title: 'Components/OfficeEditorToolsHeader',
  component: OfficeEditorToolsHeader,
};

initialState.viewer.openElements[DataElement.OFFICE_EDITOR_TOOLS_HEADER] = true;
initialState.viewer.openElements.colorPickerOverlay = false;
const store = configureStore({ reducer: () => initialState });

const BasicComponent = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export function Basic() {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
    addEventListener: () => {},
  });
  window.Core = {
    Annotations: {
      Color: () => {},
    }
  };

  return (
    <BasicComponent>
      <OfficeEditorToolsHeader />
    </BasicComponent>
  );
}