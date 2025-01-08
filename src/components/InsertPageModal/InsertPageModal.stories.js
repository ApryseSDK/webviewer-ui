import React from 'react';
import InsertPageModalComponent from './InsertPageModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

export default {
  title: 'Components/InsertPageModal',
  component: InsertPageModalComponent,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      insertPageModal: true
    },
    tab: {
      insertPageModal: 'insertBlankPagePanelButton'
    },
    selectedThumbnailPageIndexes: [0, 1],
    currentPage: 1,
    getPageCount: () => 9,
    presetNewPageDimensions: {
      'Letter': {
        'height': 11,
        'width': 8.5,
      },
      'Half letter': {
        'height': 5.5,
        'width': 8.5,
      },
      'Junior legal': {
        'height': 5,
        'width': 8,
      },
    },
  },
  featureFlags: {
    customizableUI: true,
  },
};

const store = configureStore({
  reducer: () => initialState
});

export const InsertBlankPagePanel = () => (
  <Provider store={store}>
    <InsertPageModalComponent isOpen loadedDocumentPageCount={9} />
  </Provider>
);

const insertUploadedPageStore = configureStore({
  reducer: () => ({
    viewer: {
      ...initialState.viewer,
      tab: {
        insertPageModal: 'insertUploadedPagePanelButton',
      }
    },
    featureFlags: {
      customizableUI: true,
    },
  })
});

export const InsertUploadedPagePanel = () => (
  <Provider store={insertUploadedPageStore}>
    <InsertPageModalComponent isOpen />
  </Provider>
);

export const InsertBlankPageModalInMobile = () => (
  <Provider store={store}>
    <InsertPageModalComponent isOpen />
  </Provider>
);

export const InsertUploadedPageModalInMobile = () => (
  <Provider store={insertUploadedPageStore}>
    <InsertPageModalComponent isOpen loadedDocumentPageCount={9} />
  </Provider>
);

InsertBlankPageModalInMobile.parameters = window.storybook?.MobileParameters;
InsertUploadedPageModalInMobile.parameters = window.storybook?.MobileParameters;