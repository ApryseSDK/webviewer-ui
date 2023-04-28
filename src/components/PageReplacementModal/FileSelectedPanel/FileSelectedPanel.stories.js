import React from 'react';
import FileSelectedPanel from './FileSelectedPanel';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

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

function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

const mockDocument = {
  getPageCount: () => 10,
  getFilename: () => 'helloDarknessMyOldFriend.pdf',
  loadThumbnail: (pageNumber, callback) => (Promise.resolve(callback({ pageNumber, currentSrc: 'https://placekitten.com/200/300?image=11' }))),
};

const props = {
  closeThisModal: noop,
  pageIndicesToReplace: [],
  replacePagesHandler: noop,
  documentInViewer: mockDocument,
};

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
export const FileSelected = () => {
  return (
    <Provider store={store}>
      <div className="Modal PageReplacementModal open">
        <FileSelectedPanel
          sourceDocument={mockDocument}
          {...props}
        />
      </div>
    </Provider>
  );
};
