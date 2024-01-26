import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import MainMenuFlyout from './MainMenuFlyout';
import Flyout from '../Flyout';

export default {
  title: 'ModularComponents/MainMenuFlyout',
  component: MainMenuFlyout,
};

const newDocumentButton = {
  dataElement: 'newDocumentButton',
  icon: 'icon-plus-sign',
  label: 'action.newDocument',
  title: 'action.newDocument',
  isActive: false
};
const filePickerButton = {
  dataElement: 'filePickerButton',
  icon: 'icon-header-file-picker-line',
  label: 'action.openFile',
  title: 'action.openFile',
};
const downloadButton = {
  dataElement: 'downloadButton',
  icon: 'icon-download',
  label: 'action.download',
  title: 'action.download',
};
const fullscreenButton = {
  dataElement: 'fullscreenButton',
  icon: 'icon-header-full-screen',
  label: 'action.enterFullscreen',
  title: 'action.enterFullscreen',
};
const saveAsButton = {
  dataElement: 'saveAsButton',
  icon: 'icon-save',
  label: 'saveModal.saveAs',
  title: 'saveModal.saveAs',
  isActive: false
};
const printButton = {
  dataElement: 'printButton',
  icon: 'icon-header-print-line',
  label: 'action.print',
  title: 'action.print',
  isActive: false
};
const createPortfolioButton = {
  dataElement: 'createPortfolioButton',
  icon: 'icon-pdf-portfolio',
  label: 'portfolio.createPDFPortfolio',
  title: 'portfolio.createPDFPortfolio',
  isActive: false
};
const settingsButton = {
  dataElement: 'settingsButton',
  icon: 'icon-header-settings-line',
  label: 'option.settings.settings',
  title: 'option.settings.settings',
  isActive: false
};

const divider = 'divider';

const initialState = {
  viewer: {
    activeDocumentViewerKey: 1,
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      MainMenuFlyout: true
    },
    customPanels: [],
    genericPanels: [],
    activeFlyout: 'MainMenuFlyout',
    flyoutPosition: { x: 0, y: 0 },
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    modularHeaders: {},
    flyoutMap: {
      'MainMenuFlyout': {
        dataElement: 'MainMenuFlyout',
        items: [
          newDocumentButton,
          filePickerButton,
          downloadButton,
          fullscreenButton,
          saveAsButton,
          printButton,
          divider,
          createPortfolioButton,
          divider,
          settingsButton,
        ]
      }
    },
    isFullScreen: false,
  },
  document: {
    totalPages: {
      1: 1,
    }
  }
};

const store = configureStore({
  reducer: () => initialState,
});

export const Default = () => {
  return (
    <Provider store={store}>
      <div>
        <Flyout />
      </div>
    </Provider>
  );
};
