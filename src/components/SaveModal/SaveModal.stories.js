import React from 'react';
import SaveModal from './SaveModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import core from 'core';

export default {
  title: 'Components/SaveModal',
  component: SaveModal
};

core.getDocument = () => ({
  getFilename: () => 'test',
  getType: () => 'pdf',
});


const getStore = () => {
  const initialState = {
    viewer: {
      openElements: { saveModal: true },
      disabledElements: {},
      customElementOverrides: {},
    }
  };

  function rootReducer(state = initialState, action) {
    return state;
  }

  return createStore(rootReducer);
};

export function Basic() {
  return (
    <Provider store={getStore()}>
      <SaveModal />
    </Provider>
  );
}
