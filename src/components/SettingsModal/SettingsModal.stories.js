import React from 'react';
import SettingsModal from './SettingsModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import hotkeysManager, { ShortcutKeys , SHORTCUT_CONFIGS } from 'helpers/hotkeysManager';
import { userEvent, within, expect } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'Components/SettingsModal',
  component: SettingsModal,
};

const getStore = (num) => {
  let isHighContrastMode = false;

  const initialState = {
    viewer: {
      openElements: { 'settingsModal': true },
      disabledElements: {
        ['eraserToolButton']: { disabled: false, priority: 1 },
      },
      toolButtonObjects: {
        AnnotationEraserTool: {
          dataElement: 'eraserToolButton',
          title: 'annotation.eraser',
          img: 'icon-operation-eraser',
          showColor: 'never',
        },
      },
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
      shortcutKeyMap: { ...ShortcutKeys },
      isWidgetHighlightingEnabled: true,
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
      case 'DISABLE_ELEMENT':
        return {
          ...state,
          viewer: {
            ...state.viewer,
            disabledElements: {
              ...state.viewer.disabledElements,
              [payload]: { disabled: true, priority: 2 },
            },
          },
        };
      case 'ENABLE_ELEMENT':
        return {
          ...state,
          viewer: {
            ...state.viewer,
            disabledElements: {
              ...state.viewer.disabledElements,
              [payload]: { disabled: false, priority: 1 },
            },
          },
        };
      default:
        return state;
    }
  }

  return createStore(rootReducer);
};

// Helper function to create spreadsheet store
const createSpreadsheetStore = (tabNum = 1) => {
  const store = getStore(tabNum);
  const originalGetState = store.getState;
  store.getState = () => {
    const state = originalGetState();
    return {
      ...state,
      viewer: {
        ...state.viewer,
        isSpreadsheetEditorModeEnabled: true,
      },
    };
  };
  return store;
};

export function General() {
  return (
    <Provider store={getStore(1)}>
      <SettingsModal />
    </Provider>
  );
}

export function KeyboardShortcut() {
  const store = getStore(2);
  hotkeysManager.initialize(store);

  return (
    <Provider store={getStore(2)}>
      <SettingsModal />
    </Provider>
  );
}

export function AdvancedSetting() {
  return (
    <Provider store={getStore(3)}>
      <SettingsModal />
    </Provider>
  );
}

export function GeneralDisabled() {
  return (
    <Provider store={getStore(4)}>
      <SettingsModal />
    </Provider>
  );
}

export function SpreadsheetEditor() {
  const store = createSpreadsheetStore(1);
  hotkeysManager.initialize(store);

  return (
    <Provider store={store}>
      <SettingsModal />
    </Provider>
  );
}

export function SpreadsheetKeyboardShortcuts() {
  const store = createSpreadsheetStore(2);
  hotkeysManager.initialize(store);

  return (
    <Provider store={store}>
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
  const searchInput = canvas.getByLabelText(getTranslatedText('message.searchSettingsPlaceholder'));
  await userEvent.tab();
  await expect(searchInput).toHaveFocus();

  await userEvent.tab();
  const generalButton = await canvas.findByRole('button', { name: getTranslatedText('option.settings.general') });
  await expect(generalButton).toHaveFocus();

  await userEvent.tab();
  const keyboardButton = await canvas.findByRole('button', { name: getTranslatedText('option.settings.keyboardShortcut') });
  await expect(keyboardButton).toHaveFocus();

  // Simulate pressing 'Enter' on the keyboard button
  await userEvent.keyboard('{Enter}');
  await expect(keyboardButton).toHaveClass('selected');
  await expect(keyboardButton).toHaveAttribute('aria-selected', 'true');
  await expect(keyboardButton).toHaveAttribute('aria-current', 'page');

  await userEvent.tab();
  const advancedButton = await canvas.findByRole('button', { name: getTranslatedText('option.settings.advancedSetting') });
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
  const closeModalButton = await editKeyboardShortcutModalWithin.findByRole('button', { name: getTranslatedText('action.close') });

  // Ensure the Close button inside the EditKeyboardShortcutModal is focused
  await expect(closeModalButton).toHaveFocus();

  await userEvent.tab();
  const editShortcutButton = await editKeyboardShortcutModalWithin.findByRole('button', { name: getTranslatedText('option.settings.editShortcut') });
  await expect(editShortcutButton).toHaveFocus();
};

SpreadsheetKeyboardShortcuts.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const keyboardButton = await canvas.findByRole('button', { name: getTranslatedText('option.settings.keyboardShortcut') });
  await userEvent.click(keyboardButton);

  const shortcuts = canvasElement.querySelectorAll('.shortcut-table-item');
  await expect(shortcuts).toHaveLength(SHORTCUT_CONFIGS.spreadsheet.length);

  const editButtons = canvasElement.querySelectorAll('[data-element^="edit-button-"]');
  for (const button of editButtons) {
    await expect(button).toBeDisabled();
  }
};


export const KeyboardShortcutInMobile = () => KeyboardShortcut();
KeyboardShortcutInMobile.parameters = window.storybook?.MobileParameters;

export function ViewOnlyKeyboardShortcuts() {
  const store = getStore(2);
  hotkeysManager.initialize(store);

  const originalGetState = store.getState;
  store.getState = () => {
    const state = originalGetState();
    return {
      ...state,
      viewer: {
        ...state.viewer,
        isViewOnly: true,
      },
    };
  };

  return (
    <Provider store={store}>
      <SettingsModal />
    </Provider>
  );
}

ViewOnlyKeyboardShortcuts.play = async ({ canvasElement }) => {
  const editButtons = canvasElement.querySelectorAll('[data-element^="edit-button-"]');
  for (const button of editButtons) {
    await expect(button).toBeDisabled();
  }

  expect(editButtons).toHaveLength(19);
};

const disabledToolStore = getStore(2);
export function DisabledToolsHideShortcuts() {
  hotkeysManager.initialize(disabledToolStore);

  return (
    <Provider store={disabledToolStore}>
      <SettingsModal />
    </Provider>
  );
}

DisabledToolsHideShortcuts.play = async ({ canvasElement }) => {
  disabledToolStore.dispatch({
    type: 'DISABLE_ELEMENT',
    payload: 'eraserToolButton',
  });

  const shortcuts = canvasElement.querySelectorAll('.shortcut-table-item');
  const shortcutTexts = Array.from(shortcuts).map((s) => s.textContent);

  expect(shortcutTexts.some((text) => text.includes('Eraser'))).toBe(false);

  disabledToolStore.dispatch({
    type: 'ENABLE_ELEMENT',
    payload: 'eraserToolButton',
  });

  const updatedShortcuts = canvasElement.querySelectorAll('.shortcut-table-item');
  const updatedShortcutTexts = Array.from(updatedShortcuts).map((s) => s.textContent);

  expect(updatedShortcutTexts.some((text) => text.includes('Eraser'))).toBe(true);
};
