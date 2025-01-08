import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from './Flyout';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import { menuItems } from 'components/ModularComponents/Helpers/menuItems';
import { PRESET_BUTTON_TYPES, ITEM_TYPE } from 'constants/customizationVariables';

export default {
  title: 'SheetEditor/Flyouts',
  component: Flyout,
};

const initialState = {
  viewer: {
    lastPickedToolForGroupedItems: {
      undefined: '',
    },
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      [DataElements.MAIN_MENU]: true,
    },
    genericPanels: [],
    flyoutMap: {
      [DataElements.MAIN_MENU]: {
        dataElement: DataElements.MAIN_MENU,
        items: [
          {
            ...menuItems[PRESET_BUTTON_TYPES.NEW_SHEET_DOCUMENT],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.FILE_PICKER],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.FULLSCREEN],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.SAVE_AS],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          'divider',
          {
            ...menuItems[PRESET_BUTTON_TYPES.SETTINGS],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
        ],
      },
    },
    modularComponents: {},
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: DataElements.MAIN_MENU,
    activeTabInPanel: {},
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    isSheetEditorMode: true
  },
  featureFlags: {
    customizableUI: true,
  }
};

const store = configureStore({ reducer: () => initialState });

export const MainMenuFlyout = () => (
  <Provider store={store}>
    <Flyout />
  </Provider>
);

