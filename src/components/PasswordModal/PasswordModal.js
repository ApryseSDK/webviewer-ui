import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';

import Button from 'components/Button';
import actions from 'actions';
import selectors from 'selectors';

import './PasswordModal.scss';

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
    } else {
      // when a user enters the correct password or calls core.closeDocument
      // reset state in case user loads another password-protected document
      setPassword('');
      setUserCancelled(false);
    }
  }, [dispatch, isOpen, passwordInput]);

  const handleSubmit = e => {
    e.preventDefault();

    checkPassword(password);
  };

  const renderContent = () => {
    const userExceedsMaxAttempts = attempt === maxAttempts;
    if (userExceedsMaxAttempts) {
      return <p>{t('message.encryptedAttemptsExceeded')}</p>;
    }
    if (userCancelled) {
      return <p>{t('message.encryptedUserCancelled')}</p>;
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
      <FocusTrap locked={isOpen}>
        <div className="wrapper">
          <div className="header">{t('message.passwordRequired')}</div>
          <form onSubmit={handleSubmit}>
            <div className="enter">
              <div>{t('message.enterPassword')}</div>
              <input
                className={`${wrongPassword ? 'wrong' : 'correct'}`}
                type="password"
                ref={passwordInput}
                autoComplete="current-password"
                value={password}
                onKeyDown={onKeyDown}
                onChange={e => setPassword(e.target.value)}
                aria-label={t('message.passwordRequired')}
              />
            </div>
            {wrongPassword && (
              <div className="incorrect-password">
                {t('message.incorrectPassword', {
                  remainingAttempts: maxAttempts - attempt,
                })}
              </div>
            )}
            <div className="footer">
              <Button
                className="cancel modal-button"
                dataElement="passwordCancelButton"
                label={t('action.cancel')}
                onClick={() => {
                  setUserCancelled(true);
                }}
              />
              <Button
                className="confirm modal-button"
                dataElement="passwordSubmitButton"
                label={t('action.submit')}
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      </FocusTrap>
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
      <div className="container">{renderContent()}</div>
    </div>
  );
};

export default PasswordModal;
