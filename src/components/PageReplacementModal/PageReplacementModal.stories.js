import React from 'react';
import PageReplacementModal from './PageReplacementModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { expect, userEvent } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'Components/PageReplacementModal',
  component: PageReplacementModal,
};

const initialState = {
  viewer: {
    openElements: { pageReplacementModal: true },
    disabledElements: {},
    customElementOverrides: {},
    tab: {
      pageReplacementModal: 'urlInputPanelButton',
    },
  },
};

function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

export function ReplaceURL() {
  function closeModal() {
    console.log('closeModal');
  }

  const props = {
    isOpen: true,
    closeModal,
  };

  return (
    <Provider store={store}>
      <PageReplacementModal {...props} />
    </Provider>
  );
}

ReplaceURL.play = async () => {
  window.Core = {};
  window.Core.createDocument = async (file, options) => {
    throw new Error('File could not be retrieved from the provided URL.');
  };

  window.Core.getAllowedFileExtensions = () => {
    return ['pdf', 'docx', 'txt'];
  };

  const fileInput = document.getElementById('urlInput');
  expect(fileInput).toBeInTheDocument();

  await userEvent.click(fileInput);
  await userEvent.type(fileInput, 'https://example.com/documents/document.a', { delay: 100 });

  const button = document.querySelector('.modal-btn');
  expect(button).toBeInTheDocument();
  await userEvent.click(button);

  const errorMessageDiv = document.querySelector('.no-margin');
  expect(errorMessageDiv).toBeInTheDocument();
  expect(errorMessageDiv.innerText).toBe(getTranslatedText('message.urlInputFileLoadError'));
};

const initialStateTwo = {
  viewer: {
    openElements: { pageReplacementModal: true },
    disabledElements: {},
    customElementOverrides: {},
    tab: {
      pageReplacementModal: 'filePickerPanelButton',
    },
  },
};

function rootReducerTwo(state = initialStateTwo) {
  return state;
}
const storeTwo = createStore(rootReducerTwo);
export function ReplaceUpload() {
  function closeModal() {
    console.log('closeModal');
  }

  const props = {
    isOpen: true,
    closeModal,
  };
  return (
    <Provider store={storeTwo}>
      <PageReplacementModal {...props} />
    </Provider>
  );
}

const initialStateThree = {
  viewer: {
    openElements: { pageReplacementModal: true },
    disabledElements: {},
    customElementOverrides: {},
    tab: {
      pageReplacementModal: 'customFileListPanelButton',
    },
  },
};

function rootReducerThree(state = initialStateThree) {
  return state;
}
const storeThree = createStore(rootReducerThree);
export function ReplaceCustomFile() {
  function closeModal() {
    console.log('closeModal');
  }

  const selectableFiles = [
    { id: '23', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
    { id: '24', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
    { id: '25', filename: 'foobar.pdf', thumbnail: '' },
    { id: '26', filename: 'foobar.pdf' },
    { id: '27', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
    { id: '28', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
  ];

  const props = {
    isOpen: true,
    closeModal,
    selectableFiles,
  };
  return (
    <Provider store={storeThree}>
      <div style={{ 'boxSizing': 'border-box' }}>
        <PageReplacementModal {...props} />
      </div>
    </Provider>
  );
}
