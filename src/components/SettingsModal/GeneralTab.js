import React from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import { isIE } from 'helpers/device';
import Languages from 'constants/languages';
import Theme from 'constants/theme';
import DataElements from 'constants/dataElement';
import setLanguage from '../../apis/setLanguage';
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import Choice from 'components/Choice';
import DataElementWrapper from 'components/DataElementWrapper';

import './GeneralTab.scss';

const GeneralTab = () => {
  const [
    currentLanguage,
    activeTheme
  ] = useSelector((state) => [
    selectors.getCurrentLanguage(state),
    selectors.getActiveTheme(state)
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const store = useStore();

  const changeLanguage = (value) => {
    if (value !== currentLanguage) {
      setLanguage(store)(value);
    }
  };

  const isLightMode = activeTheme === Theme.LIGHT;

  const setTheme = (theme) => {
    dispatch(actions.setActiveTheme(theme));
  };

  return (
    <>
      <DataElementWrapper
        className="setting-section"
        dataElement={DataElements.SETTINGS_LANGUAGE_SECTION}
      >
        <div className="setting-label">{t('option.settings.language')}</div>
        <Dropdown
          dataElement="languageDropdown"
          items={Languages}
          currentSelectionKey={currentLanguage}
          getKey={(item) => item[0]}
          getDisplayValue={(item) => item[1]}
          onClickItem={changeLanguage}
          maxHeight={200}
          width={336}
          getCustomItemStyle={() => ({ textAlign: 'left', width: '326px' })}
          className="language-dropdown"
        />
      </DataElementWrapper>
      {!isIE && (
        <DataElementWrapper
          className="setting-section"
          dataElement={DataElements.SETTINGS_THEME_SECTION}
        >
          <div className="setting-label">{t('option.settings.theme')}</div>
          <div className="theme-options">
            <div className={`theme-option ${isLightMode ? 'active-theme' : ''}`}>
              <Icon glyph="icon-light-mode-option" className="light-mode-icon" />
              <div className="theme-choice">
                <Choice
                  radio
                  checked={isLightMode}
                  onChange={() => setTheme(Theme.LIGHT)}
                  label={t('option.settings.lightMode')}
                  name="theme_choice"
                />
              </div>
            </div>
            <div className={`theme-option ${!isLightMode ? 'active-theme' : ''}`}>
              <Icon glyph="icon-dark-mode-option" className="dark-mode-icon" />
              <div className="theme-choice">
                <Choice
                  radio
                  checked={!isLightMode}
                  onChange={() => setTheme(Theme.DARK)}
                  label={t('option.settings.darkMode')}
                  name="theme_choice"
                />
              </div>
            </div>
          </div>
        </DataElementWrapper>
      )}
    </>
  );
};

export default GeneralTab;
