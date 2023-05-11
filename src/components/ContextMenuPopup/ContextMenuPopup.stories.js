import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import initialState from 'src/redux/initialState';
import { workerTypes } from 'constants/types';
import ContextMenuPopup from './ContextMenuPopup';

export default {
  title: 'Components/ContextMenuPopup',
  component: ContextMenuPopup,
};

initialState.viewer.openElements.contextMenuPopup = true;
const store = configureStore({ reducer: () => initialState });

const BasicComponent = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export function Basic() {
  core.getDocument = () => ({
    getType: () => workerTypes.PDF,
  });

  return (
    <BasicComponent>
      <ContextMenuPopup closeElements={() => {}} />
    </BasicComponent>
  );
}

export function OfficeEditor() {
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
  });
  core.getOfficeEditor = () => ({
    isTextSelected: () => true,
  });

  return (
    <BasicComponent>
      <ContextMenuPopup closeElements={() => {}} />
    </BasicComponent>
  );
}