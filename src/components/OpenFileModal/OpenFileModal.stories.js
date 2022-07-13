import React from 'react';
import OpenFileModal from './OpenFileModal'
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export default {
  title: 'Components/OpenFileModal',
  component: OpenFileModal
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    tab: { pageReplacementModal: 'urlInputPanelButton' }
  }
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);
store.dispatch = () => {};

export function Basic() {
  const props = {
    isOpen: true
  };

  return (
    <Provider store={store}>
      <OpenFileModal {...props} />
    </Provider>
  );
}
