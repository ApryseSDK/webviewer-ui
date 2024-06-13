import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import DataElementWrapper from 'components/DataElementWrapper';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import { Swipeable } from 'react-swipeable';
import GeneralTab from './GeneralTab';
import KeyboardShortcutTab from './KeyboardShortcutTab';
import AdvancedTab from './AdvancedTab';
import { SearchContext } from './SearchWrapper';

import './SettingsModal.scss';

const TABS_ID = DataElements.SETTINGS_MODAL;

const SettingsModal = () => {
  const [
    isDisabled,
    isHidden,
    selectedTab,
    isGeneralTabDisabled,
    isKeyboardTabDisabled,
    isAdvancedTabDisabled
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.SETTINGS_MODAL),
    selectors.isElementHidden(state, DataElements.SETTINGS_MODAL),
    selectors.getSelectedTab(state, TABS_ID),
    selectors.isElementDisabled(state, DataElements.SETTINGS_GENERAL_BUTTON),
    selectors.isElementDisabled(state, DataElements.SETTINGS_KEYBOARD_BUTTON),
    selectors.isElementDisabled(state, DataElements.SETTINGS_ADVANCED_BUTTON)
  ]);
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

  const className = classNames('Modal', 'SettingsModal', {
    open: !isHidden,
    closed: isHidden
  });

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.SETTINGS_MODAL));
  };

  const handleTabClicked = (tab) => {
    if (tab !== selectedTab) {
      dispatch(actions.setSelectedTab(TABS_ID, tab));
    }
  };

  return isDisabled ? null : (
    <SearchContext.Provider value={searchTerm}>
      <FocusTrap locked={!isHidden}>
        <div className={className} data-element={DataElements.SettingsModal} onClick={closeModal}>
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
              <div className="swipe-indicator" />
              <div className="header">
                <div className="title">
                  <div>{t('option.settings.settings')}</div>
                  <Button
                    img="icon-close"
                    onClick={closeModal}
                    title="action.close"
                  />
                </div>
                <input
                  placeholder={t('option.settings.searchSettings')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Swipeable>
            <div className="divider"></div>
            <div className="body">
              <div className="settings-tabs-container">
                <div className="settings-tabs">
                  {tabs.map(([tab, title]) => {
                    const className = classNames('settings-tab', {
                      selected: tab === selectedTab
                    });
                    return (
                      <DataElementWrapper
                        className={className}
                        dataElement={tab}
                        onClick={() => handleTabClicked(tab)}
                        key={tab}
                      >
                        {title}
                      </DataElementWrapper>
                    );
                  })}
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
        </div>
      </FocusTrap>
    </SearchContext.Provider>
  );
};

export default SettingsModal;