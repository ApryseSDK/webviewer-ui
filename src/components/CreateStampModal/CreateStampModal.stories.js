import React from 'react';
import CreateStampModal from './CreateStampModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import defaultFonts from 'constants/defaultFonts';
import defaultDateTimeFormats from 'constants/defaultDateTimeFormats';

export default {
  title: 'Components/CreateStampModal',
  component: CreateStampModal
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
  }
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

export function Basic() {
  const props = {
    isOpen: true
  };

  return (
    <Provider store={store}>
      <CreateStampModal {...props} />
    </Provider>
  );
}
