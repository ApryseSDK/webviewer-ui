import React from 'react';
import SettingsModal from './SettingsModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import hotkeysManager, { ShortcutKeys } from 'helpers/hotkeysManager';

export default {
  title: 'Components/SettingsModal',
  component: SettingsModal
};

const getStore = (num) => {
  let isHighContrastMode = false;

  const initialState = {
    viewer: {
      hiddenElements: {},
      disabledElements: {},
      customElementOverrides: {},
      tab: {},
      currentLanguage: 'en',
      activeTheme: 'light',
      customSettings: [
        {
          label: 'Enable High Contrast Mode',
          description: 'Turns high contrast mode on to help with accessibility.',
          isChecked: () => isHighContrastMode,
          onToggled: (enable) => {
            isHighContrastMode = enable;
          }
        }
      ],
      shortcutKeyMap: { ...ShortcutKeys }
    },
    search: {
      clearSearchPanelOnClose: false
    }
  };

  if (num === 1) {
    initialState.viewer.tab.settingsModal = DataElements.SETTINGS_GENERAL_BUTTON;
  } else if (num === 2) {
    initialState.viewer.tab.settingsModal = DataElements.SETTINGS_KEYBOARD_BUTTON;
  } else if (num === 3) {
    initialState.viewer.tab.settingsModal = DataElements.SETTINGS_ADVANCED_BUTTON;
  } else if (num === 4) {
    initialState.viewer.tab.settingsModal = DataElements.SETTINGS_GENERAL_BUTTON;
    initialState.viewer.disabledElements[DataElements.SETTINGS_GENERAL_BUTTON] = { disabled: true, priority: 2 };
  }

  function rootReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case 'SET_SELECTED_TAB':
        const newState = { ...state };
        newState.viewer.tab[payload.id] = payload.dataElement;
        return newState;
      default:
        return state;
    }
  }

  return createStore(rootReducer);
};

// General tab
export function General() {
  return (
    <Provider store={getStore(1)}>
      <SettingsModal />
    </Provider>
  );
}

// Keyboard Shortcut tab
export function KeyboardShortcut() {
  const store = getStore(2);
  hotkeysManager.initialize(store);

  return (
    <Provider store={getStore(2)}>
      <SettingsModal />
    </Provider>
  );
}

// Advanced Setting tab
export function AdvancedSetting() {
  return (
    <Provider store={getStore(3)}>
      <SettingsModal />
    </Provider>
  );
}

// General tab disabled
export function GeneralDisabled() {
  return (
    <Provider store={getStore(4)}>
      <SettingsModal />
    </Provider>
  );
}
