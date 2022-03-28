import React, { useState } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import actions from 'actions';
import DataElements from "constants/dataElement";
import setLanguage from '../../apis/setLanguage';
import Button from 'components/Button';
import Choice from 'components/Choice';
import { languages } from '../../apis/getAvailableLanguages';

import './LanguageModal.scss';

const LanguageModal = () => {
  const [
    isDisabled,
    isOpen,
    currentLanguage
  ] = useSelector(state => [
    selectors.isElementDisabled(state, DataElements.LANGUAGE_MODAL),
    selectors.isElementOpen(state, DataElements.LANGUAGE_MODAL),
    selectors.getCurrentLanguage(state)
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const store = useStore();
  const [uiLanguage, setUiLanguage] = useState(currentLanguage);

  const className = classNames('Modal', 'LanguageModal', {
    open: isOpen,
    closed: !isOpen
  });

  const closeModal = (resetLang = true) => {
    dispatch(actions.closeElement(DataElements.LANGUAGE_MODAL));
    resetLang && setUiLanguage(currentLanguage);
  };

  const apply = () => {
    setLanguage(store)(uiLanguage);
    closeModal(false);
  };

  return isDisabled ? null : (
    <div className={className} data-element={DataElements.LANGUAGE_MODAL} onClick={closeModal}>
      <div className="container" onClick={e => e.stopPropagation()}>
        <div className="header">
          <div>{t('languageModal.selectLanguage')}</div>
          <Button
            img="icon-close"
            onClick={closeModal}
            title="action.cancel"
          />
        </div>
        <div className="divider"></div>
        <div className="body">
          {languages.map(language => (
            <div key={language[0]}>
              <Choice
                radio={true}
                checked={uiLanguage === language[0]}
                onChange={() => setUiLanguage(language[0])}
                label={language[1]}
              />
            </div>
          ))}
        </div>
        <div className="divider"></div>
        <div className="footer">
          <div className="buttons">
            <Button
              className="confirm modal-button"
              label="action.apply"
              onClick={apply}
              disabled={uiLanguage === currentLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
