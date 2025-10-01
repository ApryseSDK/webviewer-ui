
import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};
function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

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
Basic.parameters = window.storybook.disableRtlMode;