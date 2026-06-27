import React from 'react';
import InsertUploadedPagePanel from './InsertUploadedPagePanel';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { mobileStoryParameters } from 'helpers/storybookParams';

export default {
  title: 'Components/InsertPageModal/InsertUploadedPagePanel',
  component: InsertUploadedPagePanel,
};

function noop() { }

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  },
  featureFlags: {
    customizableUI: true,
  },
};

const store = configureStore({
  reducer: () => initialState
});

const storyShellStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: '100vh',
  padding: '24px',
  boxSizing: 'border-box',
  background: 'var(--modal-negative-space)',
};

const mockLoadingDocument = {
  getPageCount: () => 10,
  getFilename: () => 'helloDarknessMyOldFriend.pdf',
  loadThumbnail: () => {},
  cancelLoadThumbnail: () => {},
};

const mockDocument = {
  getPageCount: () => 20,
  getFilename: () => 'helloDarknessMyOldFriend.pdf',
  loadThumbnail: (pageNumber, callback) => (Promise.resolve(callback({ pageNumber, currentSrc: '/assets/images/192_200x300.jpeg' }))),
  cancelLoadThumbnail: () => {},
};

export const FileLoadingDesktop = () => (
  <Provider store={store}>
    <div style={storyShellStyle}>
      <InsertUploadedPagePanel
        sourceDocument={mockLoadingDocument}
        clearLoadedFile={noop}
        closeModal={noop}
        closeModalWarning={noop}
        insertPages={noop}
        loadedDocumentPageCount={10}
      />
    </div>
  </Provider>
);

export const FileLoadedDesktop = () => (
  <Provider store={store}>
    <div style={storyShellStyle}>
      <InsertUploadedPagePanel
        sourceDocument={mockDocument}
        clearLoadedFile={noop}
        closeModal={noop}
        closeModalWarning={noop}
        insertPages={noop}
        loadedDocumentPageCount={10}
      />
    </div>
  </Provider>
);

export const FileLoadingMobile = () => (
  <Provider store={store}>
    <div style={storyShellStyle}>
      <InsertUploadedPagePanel
        sourceDocument={mockLoadingDocument}
        clearLoadedFile={noop}
        closeModal={noop}
        closeModalWarning={noop}
        insertPages={noop}
        loadedDocumentPageCount={10}
      />
    </div>
  </Provider>
);

export const FileLoadedMobile = () => (
  <Provider store={store}>
    <div style={storyShellStyle}>
      <InsertUploadedPagePanel
        sourceDocument={mockDocument}
        clearLoadedFile={noop}
        closeModal={noop}
        closeModalWarning={noop}
        insertPages={noop}
        loadedDocumentPageCount={10}
      />
    </div>
  </Provider>
);

FileLoadingMobile.parameters = mobileStoryParameters;
FileLoadedMobile.parameters = mobileStoryParameters;
