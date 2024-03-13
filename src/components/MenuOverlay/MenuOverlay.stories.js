import React, { useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MenuOverlay from './MenuOverlay';
import { Provider } from 'react-redux';

export default {
  title: 'Components/MenuOverlay',
  component: MenuOverlay,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      menuOverlay: true
    },
    customPanels: [],
    genericPanels: [],
    menuOverlay: [
      { 'dataElement': 'newDocumentButton' },
      { 'dataElement': 'filePickerButton' },
      { 'dataElement': 'fullscreenButton' },
      { 'dataElement': 'downloadButton' },
      { 'dataElement': 'saveAsButton' },
      { 'dataElement': 'printButton' },
      { 'dataElement': 'themeChangeButton' },
      { 'dataElement': 'languageButton' }
    ]
  },
  featureFlags: {
    customizableUI: false,
  },
};
const store = configureStore({
  reducer: () => initialState
});

export const MenuOverlayXOD = () => {
  window.setDocType('xod');
  useEffect(() => {
    return () => {
      window.setDocType('PDF');
    };
  });
  return (
    <Provider store={store}>
      <div style={{ position: 'relative', right: '-9999px' }}>
        <MenuOverlay/>
      </div>
    </Provider>
  );
};

export const MenuOverlayPDF = () => {
  return (
    <Provider store={store}>
      <div style={{ position: 'relative', right: '-9999px' }}>
        <MenuOverlay/>
      </div>
    </Provider>
  );
};
