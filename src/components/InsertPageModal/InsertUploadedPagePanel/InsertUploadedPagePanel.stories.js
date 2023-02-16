import React, { useState } from 'react';
import InsertUploadedPagePanel from './InsertUploadedPagePanel';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

export default {
  title: 'Components/InsertPageModal/InsertUploadedPagePanel',
  component: InsertUploadedPagePanel,
};

function noop() { }

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};

const store = configureStore({
  reducer: () => initialState
});

const mockLoadingDocument = {
  getPageCount: () => 10,
  getFilename: () => 'helloDarknessMyOldFriend.pdf',
  loadThumbnail: (pageNumber, callback) => { },
  cancelLoadThumbnail: noop,
  closeModalWarning: noop,
};

const fileLoadingProps = {
  sourceDocument: mockLoadingDocument,
  clearLoadedFile: noop,
};

export const FileLoading = () => (
  <Provider store={store}>
    <div className="Modal InsertPageModal open">
      <InsertUploadedPagePanel {...fileLoadingProps} />
    </div>
  </Provider>
);

const mockDocument = {
  getPageCount: () => 20,
  getFilename: () => 'helloDarknessMyOldFriend.pdf',
  loadThumbnail: (pageNumber, callback) => (Promise.resolve(callback({ pageNumber, currentSrc: 'https://placekitten.com/200/300?image=2' }))),
  cancelLoadThumbnail: noop,
};

export const FileLoaded = () => {
  const [selectedThumbnails, setSelectedThumbnails] = useState({});
  const onThumbnailSelected = (pageNumber) => {
    if (selectedThumbnails[pageNumber] === undefined) {
      selectedThumbnails[pageNumber] = true;
    } else {
      selectedThumbnails[pageNumber] = !selectedThumbnails[pageNumber];
    }
    setSelectedThumbnails({ ...selectedThumbnails });
  };

  const fileLoadedProps = {
    sourceDocument: mockDocument,
    selectedThumbnails,
    onThumbnailSelected,
    clearLoadedFile: noop,
    onfileLoadedHandler: noop,
    loadedDocumentPageCount: 10,
    insertPages: noop,
    closeModalWarning: noop,
  };

  return (
    <Provider store={store}>
      <div className="Modal InsertPageModal open">
        <InsertUploadedPagePanel {...fileLoadedProps} />
      </div>
    </Provider >
  );
};