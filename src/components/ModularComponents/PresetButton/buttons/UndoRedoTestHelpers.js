import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import initialState from 'src/redux/initialState';

export const createMockStore = (customState = {}) => {
  const state = {
    ...initialState,
    ...customState,
  };

  return configureStore({
    reducer: rootReducer,
    preloadedState: state,
  });
};

export const renderWithRedux = (Component, props = {}, customState = {}) => {
  const store = createMockStore(customState);
  return {
    store,
    ...render(
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    )
  };
};

export const getSpreadsheetEditorState = (canUndo = true, canRedo = true) => ({
  viewer: {
    ...initialState.viewer,
    uiConfiguration: 'spreadsheetEditor',
  },
  spreadsheetEditor: {
    ...initialState.spreadsheetEditor,
    canUndo,
    canRedo,
  },
});