import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import { Swipeable } from 'react-swipeable';
import GeneralTab from './GeneralTab';
import AdvancedTab from './AdvancedTab';

import './SettingsModal.scss';

const TABS_ID = 'settingsModal';

const SettingsModal = () => {
  const [
    isDisabled,
    isOpen,
    selectedTab
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.SETTINGS_MODAL),
    selectors.isElementOpen(state, DataElements.SETTINGS_MODAL),
    selectors.getSelectedTab(state, TABS_ID)
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const tabs = [
    [DataElements.SETTINGS_GENERAL_BUTTON, t('option.settings.general')],
    [DataElements.SETTINGS_ADVANCED_BUTTON, t('option.settings.advancedSetting')]
  ];

  const className = classNames('Modal', 'SettingsModal', {
    open: isOpen,
    closed: !isOpen
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
      <FocusTrap locked={isOpen}>
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
                      <div
                        className={className}
                        data-element={tab[0]}
                        onClick={() => handleTabClicked(tab[0])}
                        key={tab[0]}
                      >
                        {tab[1]}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="settings-content">
                {selectedTab === DataElements.SETTINGS_GENERAL_BUTTON && (
                  <GeneralTab />
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