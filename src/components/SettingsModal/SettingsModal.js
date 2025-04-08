import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';
import GeneralTab from './GeneralTab';
import KeyboardShortcutTab from './KeyboardShortcutTab';
import AdvancedTab from './AdvancedTab';
import { SearchContext } from './SearchWrapper';
import Icon from 'components/Icon';
import ModalWrapper from 'components/ModalWrapper';
import './SettingsModal.scss';

const TABS_ID = DataElements.SETTINGS_MODAL;

const SettingsModal = () => {
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.SETTINGS_MODAL));
  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.SETTINGS_MODAL));
  const isSpreadsheetEditorMode = useSelector(selectors.isSpreadsheetEditorModeEnabled);
  const selectedTab = useSelector((state) => selectors.getSelectedTab(state, TABS_ID));
  const isGeneralTabDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.SETTINGS_GENERAL_BUTTON));
  const isKeyboardTabDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.SETTINGS_KEYBOARD_BUTTON));
  const isAdvancedTabDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.SETTINGS_ADVANCED_BUTTON));
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    [DataElements.SETTINGS_GENERAL_BUTTON, t('option.settings.general')],
    [DataElements.SETTINGS_KEYBOARD_BUTTON, t('option.settings.keyboardShortcut')],
    [DataElements.SETTINGS_ADVANCED_BUTTON, t('option.settings.advancedSetting')]
  ];

  useEffect(() => {
    if (
      (selectedTab === DataElements.SETTINGS_GENERAL_BUTTON && isGeneralTabDisabled) ||
      (selectedTab === DataElements.SETTINGS_KEYBOARD_BUTTON && isKeyboardTabDisabled) ||
      (selectedTab === DataElements.SETTINGS_ADVANCED_BUTTON && isAdvancedTabDisabled)
    ) {
      let tabToEnable = '';
      if (!isGeneralTabDisabled) {
        tabToEnable = DataElements.SETTINGS_GENERAL_BUTTON;
      } else if (!isKeyboardTabDisabled) {
        tabToEnable = DataElements.SETTINGS_KEYBOARD_BUTTON;
      } else if (!isAdvancedTabDisabled) {
        tabToEnable = DataElements.SETTINGS_ADVANCED_BUTTON;
      }
      dispatch(actions.setSelectedTab(TABS_ID, tabToEnable));
    }
  }, [isGeneralTabDisabled, isKeyboardTabDisabled, isAdvancedTabDisabled]);

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.SETTINGS_MODAL));
  };

  const handleTabClicked = (tab) => {
    if (tab !== selectedTab) {
      dispatch(actions.setSelectedTab(TABS_ID, tab));
    }
  };

  if (isDisabled) {
    return null;
  }

  const className = classNames('Modal', 'SettingsModal', 'open');

  return (
    <SearchContext.Provider value={searchTerm}>
      <div className={className} data-element={DataElements.SettingsModal}>
        <ModalWrapper
          title={t('option.settings.settings')}
          closeHandler={closeModal}
          onCloseClick={closeModal}
          isOpen={isOpen}
          swipeToClose
        >
          <div className="container">
            <div className="swipe-indicator" />
            <div className="header">
              <div className="settings-search-input">
                <Icon glyph="icon-header-search" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={t('message.searchSettingsPlaceholder')}
                />
              </div>
            </div>
            <div className="divider" />
            <div className="body">
              <div className="settings-tabs-container">
                <div className="settings-tabs">
                  {tabs
                    .filter(([tab]) => {
                      if (isSpreadsheetEditorMode) {
                        return tab !== DataElements.SETTINGS_KEYBOARD_BUTTON && tab !== DataElements.SETTINGS_ADVANCED_BUTTON;
                      }
                      return true;
                    })
                    .map(([tab, title]) => {
                      const className = classNames('settings-tab', {
                        selected: tab === selectedTab
                      });
                      return (
                        <DataElementWrapper
                          type="button"
                          className={className}
                          dataElement={tab}
                          onClick={() => handleTabClicked(tab)}
                          key={tab}
                          aria-selected={tab === selectedTab}
                          aria-current={tab === selectedTab ? 'page' : null}
                        >
                          {title}
                        </DataElementWrapper>
                      );
                    })
                  }
                </div>
              </div>
              <div className={classNames('settings-content', { KeyboardShortcutTab: selectedTab === DataElements.SETTINGS_KEYBOARD_BUTTON })}>
                {selectedTab === DataElements.SETTINGS_GENERAL_BUTTON && (
                  <GeneralTab />
                )}
                {selectedTab === DataElements.SETTINGS_KEYBOARD_BUTTON && (
                  <KeyboardShortcutTab />
                )}
                {selectedTab === DataElements.SETTINGS_ADVANCED_BUTTON && (
                  <AdvancedTab />
                )}
              </div>
            </div>
          </div>
        </ModalWrapper>
      </div>
    </SearchContext.Provider>
  );
};

export default SettingsModal;