import React from 'react';
import OfficeEditorCreateTablePopup from './OfficeEditorCreateTablePopup';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import { Provider } from 'react-redux';

export default {
  title: 'Components/OfficeEditorCreateTablePopup',
  component: OfficeEditorCreateTablePopup
};

const store = configureStore({ reducer: rootReducer });

export function Basic() {
  return (
    <Provider store={store}>
      <OfficeEditorCreateTablePopup />
    </Provider>
  );
}
