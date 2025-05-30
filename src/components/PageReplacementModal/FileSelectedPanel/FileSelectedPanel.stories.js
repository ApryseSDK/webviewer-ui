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
  },
  featureFlags: {
    customizableUI: true,
  }
};

function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

const mockDocument = {
  getPageCount: () => 10,
  getFilename: () => 'helloDarknessMyOldFriend.pdf',
  loadThumbnail: (pageNumber, callback) => (Promise.resolve(callback({ pageNumber, currentSrc: '/assets/images/193_200x300.jpeg' }))),
};

const props = {
  closeThisModal: noop,
  pageIndicesToReplace: [],
  replacePagesHandler: noop,
  documentInViewer: mockDocument,
};

const ProcessingFile = () => (
  <Provider store={store}>
    <div className="Modal PageReplacementModal open">
      <FileSelectedPanel
        {...props}
      />
    </div>
  </Provider>
);

// This story is solely for the purposes of a unit test.
const FileSelected = () => {
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

export const ProcessingFileDesktop = () => <ProcessingFile />;
export const ProcessingFileMobile = () => <ProcessingFile />;
ProcessingFileMobile.parameters = window.storybook?.MobileParameters;

export const FileSelectedDesktop = () => <FileSelected />;
export const FileSelectedMobile = () => <FileSelected />;
FileSelectedMobile.parameters = window.storybook?.MobileParameters;