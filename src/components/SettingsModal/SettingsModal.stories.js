import React from 'react';
import SettingsModal from './SettingsModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import hotkeysManager, { ShortcutKeys } from 'helpers/hotkeysManager';
import { userEvent, within, expect } from '@storybook/test';

export default {
  title: 'Components/SettingsModal',
  component: SettingsModal,
  parameters: {
    customizableUI: true
  }
};

const getStore = (num) => {
  let isHighContrastMode = false;

  const initialState = {
    viewer: {
      openElements: { 'settingsModal': true },
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
    },
    featureFlags: {
      customizableUI: true,
    },
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

export function TabbingTest() {
  const store = getStore(1);
  hotkeysManager.initialize(store);
  return (
    <Provider store={getStore(1)}>
      <SettingsModal />
    </Provider>
  );
}

TabbingTest.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const searchInput = canvas.getByLabelText('Search settings');
  await userEvent.tab();
  await expect(searchInput).toHaveFocus();

  await userEvent.tab();
  const generalButton = await canvas.findByRole('button', { name: /General/i });
  await expect(generalButton).toHaveFocus();

  await userEvent.tab();
  const keyboardButton = await canvas.findByRole('button', { name: /Keyboard Shortcut/i });
  await expect(keyboardButton).toHaveFocus();

  // Simulate pressing 'Enter' on the keyboard button
  await userEvent.keyboard('{Enter}');
  await expect(keyboardButton).toHaveClass('selected');
  await expect(keyboardButton).toHaveAttribute('aria-selected', 'true');
  await expect(keyboardButton).toHaveAttribute('aria-current', 'page');

  await userEvent.tab();
  const advancedButton = await canvas.findByRole('button', { name: /Advanced Setting/i });
  await expect(advancedButton).toHaveFocus();

  await userEvent.tab();
  const rotateClockwiseEditButton = canvasElement.querySelector('[data-element="edit-button-rotateClockwise"]');
  await expect(rotateClockwiseEditButton).toHaveFocus();

  // Simulate pressing 'Enter' on the rotateClockwiseEditButton
  await userEvent.keyboard('{Enter}');

  // Ensure the EditKeyboardShortcutModal is open
  const editKeyboardShortcutModal = canvasElement.querySelector('.Modal.EditKeyboardShortcutModal.open');
  await expect(editKeyboardShortcutModal).toBeInTheDocument();

  // Scope the search to the EditKeyboardShortcutModal and look for the Close button
  const editKeyboardShortcutModalWithin = within(editKeyboardShortcutModal);
  const closeModalButton = await editKeyboardShortcutModalWithin.findByRole('button', { name: /Close/i });

  // Ensure the Close button inside the EditKeyboardShortcutModal is focused
  await expect(closeModalButton).toHaveFocus();

  await userEvent.tab();
  const editShortcutButton = await editKeyboardShortcutModalWithin.findByRole('button', { name: /Edit Shortcut/i });
  await expect(editShortcutButton).toHaveFocus();
};