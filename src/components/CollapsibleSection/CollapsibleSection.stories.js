import { configureStore } from '@reduxjs/toolkit';

import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { Provider } from 'react-redux';
import { disableRtlModeParameters } from 'helpers/storybookParams';

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};
function rootReducer(state = initialState, action) {
  return state;
}

const store = configureStore({ reducer: rootReducer });

const CollapsibleSectionWithRedux = (props) => {
  return (
    <Provider store={store}>
      <CollapsibleSection {...props} />
    </Provider>
  );
};

export default {
  title: 'Components/CollapsibleSection',
  component: CollapsibleSection,
};

const HeaderComponent = () => {
  return (
    <div>
      Page Number 1
    </div>
  );
};

export function Basic() {
  return (
    <div style={{ width: '330px' }}>
      <CollapsibleSectionWithRedux header={HeaderComponent}>
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
          <li>Four</li>
        </ul>
      </CollapsibleSectionWithRedux>
    </div>
  );
}
Basic.parameters = disableRtlModeParameters;
