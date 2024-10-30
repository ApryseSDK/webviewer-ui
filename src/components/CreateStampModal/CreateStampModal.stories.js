import React from 'react';
import CreateStampModal from './CreateStampModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import defaultFonts from 'constants/defaultFonts';
import defaultDateTimeFormats from 'constants/defaultDateTimeFormats';
import { userEvent, expect } from '@storybook/test';

export default {
  title: 'Components/CreateStampModal',
  component: CreateStampModal,
  parameters: {
    customizableUI: true,
  },
};

const initialState = {
  viewer: {
    openElements: { customStampModal: true },
    disabledElements: {},
    customElementOverrides: {},
    fonts: defaultFonts,
    dateTimeFormats: defaultDateTimeFormats
  },
  user: {
    name: 'TestName'
  },
  featureFlags: {
    customizableUI: true,
  },
};

function rootReducer(state = initialState, action) {
  return state;
}

const props = {
  isOpen: true
};

const store = createStore(rootReducer);
export const Basic = () => (
  <Provider store={store}>
    <CreateStampModal {...props} />
  </Provider>
);


Basic.play = async () => {
  const stampTextInput = await document.getElementById('stampTextInput');
  expect(stampTextInput).toBeInTheDocument();
  stampTextInput.value = null;
  await userEvent.click(stampTextInput);
  await userEvent.type(stampTextInput, '22', { delay: 100 });
  await userEvent.clear(stampTextInput);

  const errorMessageDiv = await document.querySelector('.empty-stamp-input');
  expect(errorMessageDiv).toBeInTheDocument();
  expect(errorMessageDiv.innerText).not.toBeNull;
};
