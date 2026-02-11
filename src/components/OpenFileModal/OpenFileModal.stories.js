import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import OpenFileModal from './OpenFileModal';
import { expect, userEvent, within } from 'storybook/test';
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

const store = configureStore({ reducer: rootReducer, preloadedState: initialState });
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

  const modifiedStore = configureStore({ reducer: rootReducer, preloadedState: modifiedState });
  modifiedStore.dispatch = () => {};

  return (
    <Provider store={modifiedStore}>
      <OpenFileModal />
    </Provider>
  );
}

BasicWithUrlInputError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const errorString = getTranslatedText('message.urlInputFileLoadError');

  const extensions = ['pdf', 'docx', 'txt'];
  window.Core = {
    SupportedFileFormats: {
      CLIENT: extensions,
    },
    getAllowedFileExtensions: () => extensions,
    performDocumentCreationChecks: async () => {
      throw new Error(errorString);
    },
  };

  const fileInput = canvas.getByRole('textbox', { name: getTranslatedText('link.enterUrlAlt') });
  expect(fileInput).toBeInTheDocument();

  await userEvent.click(fileInput);
  await userEvent.type(fileInput, 'https://example.com/documents/document.pdf');

  const dropDown = canvas.getByRole('combobox', { name: getTranslatedText('OpenFile.extension') });
  expect(dropDown).toBeInTheDocument();
  await userEvent.click(dropDown);

  const pdfOption = canvas.getByRole('option', { name: 'pdf' });
  expect(pdfOption).toBeInTheDocument();
  await userEvent.click(pdfOption);

  const button = canvas.getByRole('button', { name: getTranslatedText('OpenFile.addTab') });
  expect(button).toBeInTheDocument();
  await userEvent.click(button);

  const errorMessage = canvas.getByText(errorString);
  expect(errorMessage).toBeInTheDocument();
};
