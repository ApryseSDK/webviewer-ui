import React from 'react';
import CellBorders from './CellBorders';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';

export default {
  title: 'ModularComponents/CellBorders',
  component: CellBorders,
};

const store = configureStore({ reducer: rootReducer });

export function cellBordersToggleButton() {
  return (
    <Provider store={store}>
      <div>
        <CellBorders />
      </div>
    </Provider>
  );
}

export const cellBordersInFlyout = () => {
  return (
    <Provider store={store}>
      <div>
        <CellBorders isFlyoutItem={true} />
      </div>
    </Provider>
  );
};
