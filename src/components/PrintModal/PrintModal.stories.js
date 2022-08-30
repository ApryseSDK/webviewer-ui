import React from 'react';
import PrintModalComponent from './PrintModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { copyMapWithDataProperties } from 'constants/map';

export default {
  title: 'Components/PrintModal',
  component: PrintModal,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      printModal: true,
    },
    pageLabels: [],
    sortStrategy: 'position',
    colorMap: copyMapWithDataProperties('currentStyleTab', 'iconColor'),
    displayMode: 'Single',
    currentPage: 1
  },
  document: {
    printQuality: 1,
  }
};

function rootReducer(state = initialState) {
  return state;
}

const store = configureStore({
  reducer: () => initialState
});

export const PrintModal = () => (
  <Provider store={store}>
    <div>
      <PrintModalComponent />
    </div>
  </Provider>
);