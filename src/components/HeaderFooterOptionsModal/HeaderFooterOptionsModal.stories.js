import React from 'react';
import HeaderFooterOptionsModal from './HeaderFooterOptionsModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';

export default {
  title: 'Components/HeaderFooterOptionsModal',
  component: HeaderFooterOptionsModal,
};

const initialState = {
  viewer: {
    openElements: { [DataElements.HEADER_FOOTER_OPTIONS_MODAL]: true },
    disabledElements: {},
    customElementOverrides: {},
  }
};

const store = configureStore({ reducer: () => initialState });

export function Basic() {
  return (
    <Provider store={store}>
      <HeaderFooterOptionsModal headerToTop='1.27' footerToBottom='1.27' layout='no_selection' />
    </Provider>
  );
}
