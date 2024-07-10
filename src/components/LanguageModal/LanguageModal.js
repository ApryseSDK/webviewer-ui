import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import Languages from 'constants/languages';
import setLanguage from '../../apis/setLanguage';
import Button from 'components/Button';
import Choice from 'components/Choice';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import { Swipeable } from 'react-swipeable';

import './LanguageModal.scss';

const LanguageModal = () => {
  const [
    isDisabled,
    isOpen,
    disabledElements,
    currentLanguage
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.LANGUAGE_MODAL),
    selectors.isElementOpen(state, DataElements.LANGUAGE_MODAL),
    selectors.getDisabledElements(state),
    selectors.getCurrentLanguage(state)
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const store = useStore();
  const [uiLanguage, setUiLanguage] = useState(currentLanguage); // uiLanguage can not be null

  useEffect(() => {
    setUiLanguage(currentLanguage);
  }, [currentLanguage]);

  const className = classNames('Modal', 'LanguageModal', {
    open: isOpen,
    closed: !isOpen
  });

  const closeModal = (resetLang = true) => {
    dispatch(actions.closeElement(DataElements.LANGUAGE_MODAL));
    resetLang && setUiLanguage(currentLanguage);
  };

  const apply = () => {
    if (uiLanguage !== currentLanguage) {
      setLanguage(store)(uiLanguage);
    }
    closeModal(false);
  };

  return isDisabled ? null : (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <FocusTrap locked={isOpen}>
        <div className={className} data-element={DataElements.LANGUAGE_MODAL} onClick={closeModal}>
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <div className="swipe-indicator" />
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
              {Languages.map((language) => {
                const dataElement = `${language[0]}-option`;
                const isOptionDisabled = disabledElements[dataElement]?.disabled;
                if (isOptionDisabled) {
                  return null;
                }
                return (
                  <div key={language[0]} data-element={dataElement}>
                    <Choice
                      radio
                      checked={uiLanguage === language[0]}
                      onChange={() => setUiLanguage(language[0])}
                      label={language[1]}
                      name="ui_language"
                    />
                  </div>
                );
              })}
            </div>
            <div className="divider"></div>
            <div className="footer">
              <Button
                className="confirm modal-button"
                label="action.apply"
                onClick={apply}
              />
            </div>
          </div>
        </div>
      </FocusTrap>
    </Swipeable>
  );
};

export default LanguageModal;
