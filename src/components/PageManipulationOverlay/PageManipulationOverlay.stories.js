import React from 'react';
import PageManipulationOverlay from './PageManipulationOverlay'

import { createStore } from 'redux';

import { Provider } from "react-redux";


export default {
  title: 'Components/PageManipulationOverlay',
  component: PageManipulationOverlay,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};
function rootReducer(state = initialState, action) {
  return state;
}

const testProps = {
  pageNumbers: [],
  pageManipulationOverlayItems: [
    { dataElement: 'pageRotationControls' },
    { type: 'divider' },
    { dataElement: 'pageInsertionControls' },
    { type: 'divider' },
    { dataElement: 'pageManipulationControls' },
  ]
};

const store = createStore(rootReducer);

export function Basic() {

  return (
    <Provider store={store}>
      <div className='Overlay FlyoutMenu'>
        <PageManipulationOverlay {...testProps} />
      </div>
    </Provider>
  );
}


