import { createStore } from "redux";
import { Provider } from "react-redux";
import React from "react";

// mock initial state.
// UI Buttons are redux connected, and they need a state or the
// tests will error out
const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    panelWidths: {
      redactionPanel: 330,
    },
    currentLanguage: 'en',
    openElements: {},
  },
  search: {
    redactionSearchPatterns: {},
  }
};

function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}

const store = createStore(rootReducer);

export default function withMockRedux(Component) {
  return function WithMockReduxWrapper(props) {
    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
}
