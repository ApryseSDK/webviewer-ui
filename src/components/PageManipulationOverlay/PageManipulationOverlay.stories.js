import React from 'react';
import PageManipulationOverlay from './PageManipulationOverlay';

import { createStore } from 'redux';

import { Provider } from 'react-redux';


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
function rootReducer(state = initialState) {
  return state;
}

const testProps = {
  pageNumbers: [],
  pageManipulationOverlayItems: [
    { dataElement: 'pageAdditionalControls' },
    { type: 'divider' },
    { dataElement: 'pageRotationControls' },
    { type: 'divider' },
    { dataElement: 'pageManipulationControls' },
  ]
};

const store = createStore(rootReducer);

export function Basic() {
  return (
    <Provider store={store}>
      <div id="app">
        <div className="Overlay FlyoutMenu">
          <PageManipulationOverlay {...testProps} />
        </div>
      </div>
    </Provider>
  );
}
