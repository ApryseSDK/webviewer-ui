import { createStore } from "redux";
import { Provider } from "react-redux";
import React from "react";

// mock initial state.
// There should not be need to set any initial state as
// we should only test "display" components and not the redux part.
const initialState = {};

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
