import React from 'react';
import SettingsModal from './SettingsModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';

export default {
  title: 'Components/SettingsModal',
  component: SettingsModal
};

const getStore = (num) => {
  const initialState = {
    viewer: {
      openElements: { [DataElements.SETTINGS_MODAL]: true },
      disabledElements: {},
      customElementOverrides: {},
      tab: {},
      currentLanguage: 'en',
      activeTheme: 'light'
    },
    search: {
      clearSearchPanelOnClose: false
    }
  };

  if (num === 1) {
    initialState.viewer.tab.settingsModal = DataElements.SETTINGS_GENERAL_BUTTON;
  } else if (num === 2) {
    initialState.viewer.tab.settingsModal = DataElements.SETTINGS_ADVANCED_BUTTON;
  }

  function rootReducer(state = initialState, action) {
    return state;
  }

  return createStore(rootReducer);
};

// State 1
export function General() {
  return (
    <Provider store={getStore(1)}>
      <SettingsModal />
    </Provider>
  );
}

// State 2
export function AdvancedSetting() {
  return (
    <Provider store={getStore(2)}>
      <SettingsModal />
    </Provider>
  );
}
