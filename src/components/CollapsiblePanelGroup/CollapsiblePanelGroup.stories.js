
import React from 'react';
import CollapsiblePanelGroup from './CollapsiblePanelGroup';
import { createStore } from 'redux';
import { Provider } from "react-redux";

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

const CollapsiblePanelGroupWithRedux = (props) => {
  return (
    <Provider store={store}>
      <CollapsiblePanelGroup {...props} />
    </Provider>
  )
};

export default {
  title: 'Components/CollapsiblePanelGroup',
  component: CollapsiblePanelGroup,
};

const HeaderComponent = () => {
  return (
    <div className="redaction-search-results-page-number">
      Page Number 1
    </div>
  )
};

export function Basic() {
  return (
    <div style={{ width: '330px' }}>
      <CollapsiblePanelGroupWithRedux header={HeaderComponent}>
        <div role="list">
          <div>One</div>
          <div>Two</div>
          <div>Three</div>
          <div>Four</div>
        </div>
      </CollapsiblePanelGroupWithRedux>
    </div>
  );
}