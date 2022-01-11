import React from 'react';
import FileSelectedPanel from './FileSelectedPanel'
import { createStore } from 'redux';
import { Provider } from "react-redux";
import core from 'core';

export default {
  title: 'Components/PageReplacementModal/FileSelectedPanel',
  component: FileSelectedPanel,
};

function noop() { }

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

const mockDocument = {
  getPageCount: () => 10,
  getFilename: () => 'helloDarknessMyOldFriend.pdf',
  loadThumbnail: (pageNumber, callback) => (Promise.resolve(callback({ pageNumber, currentSrc: 'https://placekitten.com/g/200/300' }))),
};

const props = {
  closeThisModal: noop,
  pageIndicesToReplace: [],
  replacePagesHandler: noop,
  documentInViewer: mockDocument,
};


// This story runs the component with an actual document instance
export const FileSelected = (args, { loaded: { sourceDocument } }) => {
  return (
    <Provider store={store}>
      <div className="Modal PageReplacementModal open">
        <FileSelectedPanel
          {...props}
          sourceDocument={sourceDocument}
        />
      </div>
    </Provider>
  )
};

// Loaders is how you run async/await in StoryBook
FileSelected.loaders = [
  async () => ({
    sourceDocument: await core.createDocument('https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'),
  }),
];

export const ProcessingFile = () => (
  <Provider store={store}>
    <div className="Modal PageReplacementModal open">
      <FileSelectedPanel
        {...props}
      />
    </div>
  </Provider>
);

// This story is solely for the purposes of a unit test
export const StoryForTest = () => {
  return (
    <Provider store={store}>
      <div className="Modal PageReplacementModal open">
        <FileSelectedPanel
          sourceDocument={mockDocument}
          {...props}
        />
      </div>
    </Provider>
  )
};