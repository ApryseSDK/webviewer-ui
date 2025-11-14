import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import OpenFileModal from './OpenFileModal';
import { expect, userEvent } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'Components/OpenFileModal',
  component: OpenFileModal,
};

const props = {
  tabManager: {
    addTab: () => {},
    getTab: () => ({
      options: {
        filename: 'document.pdf',
        extension: 'pdf',
        size: 123456,
      },
    }),
  },
  closeElements: () => () => console.log('closeElements called'),
};

const initialState = {
  viewer: {
    disabledElements: {},
    openElements: {
      OpenFileModal: true,
    },
    customElementOverrides: {},
    tab: { openFileModal: 'urlInputPanelButton' },
  },
  featureFlags: {
    customizableUI: true,
  },
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);
store.dispatch = () => {};

export function Basic() {
  return (
    <Provider store={store}>
      <OpenFileModal />
    </Provider>
  );
}

export function BasicWithUrlInputError() {
  const modifiedState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      disabledElements: {
        OpenFileModal: true,
      },
    },
  };

  window.Core = {};
  window.Core.SupportedFileFormats = {};
  window.Core.SupportedFileFormats.CLIENT = ['pdf', 'docx', 'txt'];
  window.Core.getAllowedFileExtensions = () => {
    return ['pdf', 'docx', 'txt'];
  };

  const modifiedStore = createStore(rootReducer, modifiedState);
  modifiedStore.dispatch = () => {};

  return (
    <Provider store={modifiedStore}>
      <OpenFileModal />
    </Provider>
  );
}

BasicWithUrlInputError.play = async () => {
  window.Core = {};
  window.Core.createDocument = async (file, options) => {
    throw new Error('File could not be retrieved from the provided URL.');
  };
  window.Core.SupportedFileFormats = {};
  window.Core.SupportedFileFormats.CLIENT = ['pdf', 'docx', 'txt'];

  window.Core.getAllowedFileExtensions = () => {
    return ['pdf', 'docx', 'txt'];
  };

  const fileInput = document.getElementById('urlInput');
  expect(fileInput).toBeInTheDocument();

  await userEvent.click(fileInput);
  await userEvent.type(fileInput, 'https://example.com/documents/document.pdf', { delay: 100 });

  const dropDown = document.getElementById('open-file-extension-dropdown');
  expect(dropDown).toBeInTheDocument();
  await userEvent.click(dropDown);

  const pdfOption = document.getElementById('open-file-extension-dropdown-pdf');
  expect(pdfOption).toBeInTheDocument();
  await userEvent.click(pdfOption);

  const button = document.querySelector('.modal-btn');
  expect(button).toBeInTheDocument();
  await userEvent.click(button);

  const errorMessageDiv = document.querySelector('.no-margin');
  expect(errorMessageDiv).toBeInTheDocument();
  expect(errorMessageDiv.innerText).toBe(getTranslatedText('message.urlInputFileLoadError'));
};
