import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import actions from 'actions';
import selectors from 'selectors';

import './PasswordModal.scss';
import ModalWrapper from '../ModalWrapper';
import { escapePressListener } from 'helpers/accessibility';

let checkPassword = () => {};
export const setCheckPasswordFunction = fn => {
  checkPassword = fn;
};

const PasswordModal = () => {
  const [isOpen, attempt, isMultiTab] = useSelector(
    state => [
      selectors.isElementOpen(state, 'passwordModal'),
      selectors.getPasswordAttempts(state),
      selectors.getIsMultiTab(state)
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const passwordInput = React.createRef();
  const maxAttempts = 3;
  const [password, setPassword] = useState('');
  const [userCancelled, setUserCancelled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElement('progressModal'));
      passwordInput.current?.focus();
      window.addEventListener('keydown', e => escapePressListener(e, closeModal));
    } else {
      // when a user enters the correct password or calls core.closeDocument
      // reset state in case user loads another password-protected document
      setPassword('');
      setUserCancelled(false);
    }
    return () => window.removeEventListener('keydown', escapePressListener);
  }, [dispatch, isOpen, passwordInput]);

  const handleSubmit = e => {
    e.preventDefault();

    checkPassword(password);
  };

  const closeModal = (event) => {
    if(event.key === 'Escape') {
      setUserCancelled(true);
    } else {
      dispatch(actions.closeElement('passwordModal'));
    }
  }

  const getErrorModal = (errorMessage) => {
    return (
      <ModalWrapper isOpen={isOpen} title={'message.error'}
        closeButtonDataElement={'errorModalCloseButton'} 
        onCloseClick={closeModal}>
          <div className="modal-content error-modal-content">
            <p>{t(errorMessage)}</p>
          </div>
          <div className="modal-footer footer">
            <Button
              className="confirm modal-button"
              dataElement="passwordSubmitButton"
              label={t('action.ok')}
              onClick={closeModal}
            />
          </div>
        </ModalWrapper>
     );
  }

  const renderContent = () => {
    const userExceedsMaxAttempts = attempt === maxAttempts;
    if (userExceedsMaxAttempts) {
      return getErrorModal('message.encryptedAttemptsExceeded');
    }
    if (userCancelled) {
      return getErrorModal('message.encryptedUserCancelled');
    }

    return renderEnterPasswordContent();
  };

  const onKeyDown = e => {
    if (e.which === 13) {
      handleSubmit(e);
    }
  };

  const renderEnterPasswordContent = () => {
    const wrongPassword = attempt !== 0;

    return (
      <ModalWrapper isOpen={isOpen} title={'message.passwordRequired'}
        closeButtonDataElement={'errorModalCloseButton'} 
        onCloseClick={() => {
          setUserCancelled(true);
        }}>
        <form onSubmit={handleSubmit}>
          <div>{t('message.enterPassword')}</div>
          <input
            className={`${wrongPassword ? 'wrong' : 'correct'} text-input-modal`}
            type="password"
            ref={passwordInput}
            autoComplete="current-password"
            value={password}
            onKeyDown={onKeyDown}
            onChange={e => setPassword(e.target.value)}
            aria-label={t('message.passwordRequired')}
            placeholder={t('message.enterPasswordPlaceholder')}
          />
          {wrongPassword && (
            <div className="incorrect-password">
              {t('message.incorrectPassword', {
                remainingAttempts: maxAttempts - attempt,
              })}
            </div>
          )}
        </form>
        <div className="modal-footer footer">
          <Button
            className="confirm modal-button"
            dataElement="passwordSubmitButton"
            label={t('action.submit')}
            disabled={!password}
            onClick={handleSubmit}
          />
        </div>
      </ModalWrapper>
    );
  };


  let tabsPadding = 0;
  if (isMultiTab) {
    // Add tabsheader padding
    tabsPadding += document.getElementsByClassName("TabsHeader")[0]?.getBoundingClientRect().bottom;
  }

  return (
    <div
      className={classNames({
        Modal: true,
        PasswordModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element="passwordModal"
      style={isMultiTab ? { height: `calc(100% - ${tabsPadding}px)` } : undefined}
    >
      {renderContent()}
    </div>
  );
};

export default PasswordModal;
