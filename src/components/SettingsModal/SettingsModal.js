import React from 'react';
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

import './SettingsModal.scss';

const TABS_ID = 'settingsModal';

const SettingsModal = () => {
  const [
    isDisabled,
    isHidden,
    selectedTab
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.SETTINGS_MODAL),
    selectors.isElementHidden(state, DataElements.SETTINGS_MODAL),
    selectors.getSelectedTab(state, TABS_ID)
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const tabs = [
    [DataElements.SETTINGS_GENERAL_BUTTON, t('option.settings.general')],
    [DataElements.SETTINGS_KEYBOARD_BUTTON, t('option.settings.keyboardShortcut')],
    [DataElements.SETTINGS_ADVANCED_BUTTON, t('option.settings.advancedSetting')]
  ];

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
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <FocusTrap locked={!isHidden}>
        <div className={className} data-element={DataElements.SettingsModal} onClick={closeModal}>
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <div className="swipe-indicator" />
            <div className="header">
              <div>{t('option.settings.settings')}</div>
              <Button
                img="icon-close"
                onClick={closeModal}
                title="action.close"
              />
            </div>
            <div className="divider"></div>
            <div className="body">
              <div className="settings-left-panel">
                <div className="settings-tabs">
                  {tabs.map((tab) => {
                    const className = classNames('settings-tab', {
                      selected: tab[0] === selectedTab
                    });
                    return (
                      <DataElementWrapper
                        className={className}
                        dataElement={tab[0]}
                        onClick={() => handleTabClicked(tab[0])}
                        key={tab[0]}
                      >
                        {tab[1]}
                      </DataElementWrapper>
                    );
                  })}
                </div>
              </div>
              <div className="settings-content">
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
    </Swipeable>
  );
};

export default SettingsModal;