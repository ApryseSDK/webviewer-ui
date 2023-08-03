import React from 'react';
import SaveModal from './SaveModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export default {
  title: 'Components/SaveModal',
  component: SaveModal
};
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
