import actions from 'actions';
import selectors from 'selectors';
import touchEventManager from 'helpers/TouchEventManager';
import setLanguage from './setLanguage';
import hotkeysManager, { ShortcutKeys } from 'helpers/hotkeysManager';

/**
 * Set custom settings shown in Advanced Setting tab in Settings modal.
 * A custom setting item includes a label, a description, and a toggle button.
 * @method UI.setCustomSettings
 * @param {Array<UI.CustomSettingItem>} customSettings Array of custom setting items.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setCustomSettings([
      {
        label: 'Enable High Contrast Mode',
        description: 'Turns high contrast mode on to help with accessibility.',
        isChecked: () => instance.UI.isHighContrastModeEnabled(),
        onToggled: (enable) => {
          if (enable) {
            instance.UI.enableHighContrastMode();
          } else {
            instance.UI.disableHighContrastMode();
          }
        }
      }
    ]);
  });
 */
export const setCustomSettings = (store) => (customSettings) => {
  store.dispatch(actions.setCustomSettings(customSettings));
};

/**
 * @typedef {Object} UI.CustomSettingItem
 * @property {string} label Custom setting label
 * @property {string} description Custom setting description
 * @property {function|boolean} isChecked Whether the toggle button is checked.
 * @property {function} onToggled The callback function triggered when the toggle button is clicked.
 */

const SettingKeys = {
  'LANGUAGE': 'language',
  'THEME': 'theme',
  'KEYBOARD_SHORTCUT': 'keyboardShortcut',
  'DISABLE_FADE_PAGE_NAV': 'disableFadePageNavigationComponent',
  'DISABLE_NATIVE_SCROLL': 'disableNativeScrolling',
  'DISABLE_TOOL_STYLE_UPDATE': 'disableToolDefaultStyleUpdateFromAnnotationPopup',
  'DISABLE_NOTE_SUBMIT_ENTER': 'disableNoteSubmissionWithEnter',
  'DISABLE_AUTO_EXPAND_COMMENT': 'disableAutoExpandCommentThread',
  'DISABLE_REPLY_COLLAPSE': 'disableReplyCollapse',
  'DISABLE_TEXT_COLLAPSE': 'disableTextCollapse',
  'DISABLE_CLEAR_SEARCH_ON_CLOSE': 'disableClearSearchOnPanelClose',
  'DISABLE_PAGE_DELETE_CONFIRM': 'disablePageDeletionConfirmationModal',
  'DISABLE_THUMBNAIL_MULTI_SELECT': 'disableThumbnailMultiselect'
};
/**
 * Export the current user settings as JSON object.
 * @method UI.exportUserSettings
 * @return {object} JSON object containing the current user settings
 * @example
WebViewer(...)
  .then(function (instance) {
    const userSettings = instance.UI.exportUserSettings();
    console.log(userSettings);
  });
 */
export const exportUserSettings = (store) => () => {
  const state = store.getState();
  return {
    [SettingKeys.LANGUAGE]: selectors.getCurrentLanguage(state),
    [SettingKeys.THEME]: selectors.getActiveTheme(state),
    [SettingKeys.KEYBOARD_SHORTCUT]: selectors.getShortcutKeyMap(state),
    [SettingKeys.DISABLE_FADE_PAGE_NAV]: !selectors.shouldFadePageNavigationComponent(state),
    [SettingKeys.DISABLE_NATIVE_SCROLL]: !touchEventManager.useNativeScroll,
    [SettingKeys.DISABLE_TOOL_STYLE_UPDATE]: !selectors.isToolDefaultStyleUpdateFromAnnotationPopupEnabled(state),
    [SettingKeys.DISABLE_NOTE_SUBMIT_ENTER]: !selectors.isNoteSubmissionWithEnterEnabled(state),
    [SettingKeys.DISABLE_AUTO_EXPAND_COMMENT]: !selectors.isCommentThreadExpansionEnabled(state),
    [SettingKeys.DISABLE_REPLY_COLLAPSE]: !selectors.isNotesPanelRepliesCollapsingEnabled(state),
    [SettingKeys.DISABLE_TEXT_COLLAPSE]: !selectors.isNotesPanelTextCollapsingEnabled(state),
    [SettingKeys.DISABLE_CLEAR_SEARCH_ON_CLOSE]: !selectors.shouldClearSearchPanelOnClose(state),
    [SettingKeys.DISABLE_PAGE_DELETE_CONFIRM]: !selectors.pageDeletionConfirmationModalEnabled(state),
    [SettingKeys.DISABLE_THUMBNAIL_MULTI_SELECT]: !selectors.isThumbnailSelectingPages(state)
  };
};

/**
 * Import user settings from JSON object.
 * @method UI.importUserSettings
 * @param {object} userSettings JSON object containing the new user settings
 * @example
WebViewer(...)
  .then(function (instance) {
    const userSettings = instance.UI.exportUserSettings();
    const newUserSettings = {
      'theme': 'dark',
      'keyboardShortcut': { ...userSettings.keyboardShortcut, 'search': 'command+m' }
    };
    instance.UI.importUserSettings(newUserSettings);
  });
 */
export const importUserSettings = (store) => (userSettings) => {
  if (SettingKeys.LANGUAGE in userSettings) {
    setLanguage(store)(userSettings[SettingKeys.LANGUAGE]);
  }
  if (SettingKeys.THEME in userSettings) {
    store.dispatch(actions.setActiveTheme(userSettings[SettingKeys.THEME]));
  }
  if (SettingKeys.DISABLE_FADE_PAGE_NAV in userSettings) {
    if (userSettings[SettingKeys.DISABLE_FADE_PAGE_NAV]) {
      store.dispatch(actions.disableFadePageNavigationComponent());
    } else {
      store.dispatch(actions.enableFadePageNavigationComponent());
    }
  }
  if (SettingKeys.DISABLE_NATIVE_SCROLL in userSettings) {
    touchEventManager.useNativeScroll = !userSettings[SettingKeys.DISABLE_NATIVE_SCROLL];
  }
  if (SettingKeys.DISABLE_TOOL_STYLE_UPDATE in userSettings) {
    store.dispatch(actions.setToolDefaultStyleUpdateFromAnnotationPopupEnabled(!userSettings[SettingKeys.DISABLE_TOOL_STYLE_UPDATE]));
  }
  if (SettingKeys.DISABLE_NOTE_SUBMIT_ENTER in userSettings) {
    store.dispatch(actions.setNoteSubmissionEnabledWithEnter(!userSettings[SettingKeys.DISABLE_NOTE_SUBMIT_ENTER]));
  }
  if (SettingKeys.DISABLE_AUTO_EXPAND_COMMENT in userSettings) {
    store.dispatch(actions.setCommentThreadExpansion(!userSettings[SettingKeys.DISABLE_AUTO_EXPAND_COMMENT]));
  }
  if (SettingKeys.DISABLE_REPLY_COLLAPSE in userSettings) {
    store.dispatch(actions.setNotesPanelRepliesCollapsing(!userSettings[SettingKeys.DISABLE_REPLY_COLLAPSE]));
  }
  if (SettingKeys.DISABLE_TEXT_COLLAPSE in userSettings) {
    store.dispatch(actions.setNotesPanelTextCollapsing(!userSettings[SettingKeys.DISABLE_TEXT_COLLAPSE]));
  }
  if (SettingKeys.DISABLE_CLEAR_SEARCH_ON_CLOSE in userSettings) {
    store.dispatch(actions.setClearSearchOnPanelClose(!userSettings[SettingKeys.DISABLE_CLEAR_SEARCH_ON_CLOSE]));
  }
  if (SettingKeys.DISABLE_PAGE_DELETE_CONFIRM in userSettings) {
    if (userSettings[SettingKeys.DISABLE_PAGE_DELETE_CONFIRM]) {
      store.dispatch(actions.disablePageDeletionConfirmationModal());
    } else {
      store.dispatch(actions.enablePageDeletionConfirmationModal());
    }
  }
  if (SettingKeys.DISABLE_THUMBNAIL_MULTI_SELECT in userSettings) {
    store.dispatch(actions.setThumbnailSelectingPages(!userSettings[SettingKeys.DISABLE_THUMBNAIL_MULTI_SELECT]));
  }
  if (SettingKeys.KEYBOARD_SHORTCUT in userSettings) {
    const shortcutKeyMap = selectors.getShortcutKeyMap(store.getState());
    Object.values(shortcutKeyMap).forEach((key) => {
      hotkeysManager.off(key);
    });

    const newShortcutKeyMap = userSettings[SettingKeys.KEYBOARD_SHORTCUT];
    Object.keys(newShortcutKeyMap).forEach((shortcut) => {
      hotkeysManager.on(newShortcutKeyMap[shortcut], hotkeysManager.keyHandlerMap[ShortcutKeys[shortcut]]);
    });

    store.dispatch(actions.setShortcutKeyMap({ ...newShortcutKeyMap }));
  }
};
