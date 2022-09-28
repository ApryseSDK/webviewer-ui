import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import OpenFileModal from './OpenFileModal';

export default {
  title: 'Components/OpenFileModal',
  component: OpenFileModal
};

const initialState = {
  viewer: {
    disabledElements: {},
    openElements: {
      OpenFileModal: true
    },
    customElementOverrides: {},
    tab: { openFileModal: 'urlInputPanelButton' }
  }
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
