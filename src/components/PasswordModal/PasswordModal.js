import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Button from 'components/Button';

import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './PasswordModal.scss';

const propTypes = {
  isOpen: PropTypes.bool,
  attempt: PropTypes.number.isRequired,
  checkPassword: PropTypes.func,
  setPasswordAttempts: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  closeElement: PropTypes.func.isRequired,
};

const PasswordModal = props => {
  const {
    isOpen,
    attempt,
    checkPassword,
    t,
    closeElement,
  } = props;
  const initialState = {
    password: '',
    userCancelled: false,
  };
  const passwordInput = React.createRef();
  const maxAttempts = 3;
  const [password, setPassword] = useState(initialState.password);
  const [userCancelled, setUserCancelled] = useState(initialState.userCancelled);

  useEffect(() => {
    if (isOpen) {
      closeElement('progressModal');
    }
    if (!isOpen) {
      // when a user enters the correct password or calls core.closeDocument
      // reset state in case user loads another password-protected document
      setPassword(initialState.password);
      setUserCancelled(initialState.userCanceled);
    }
    if (passwordInput.current) {
      passwordInput.current.focus();
    }
  }, [isOpen,passwordInput]);

  const handleInputChange = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    checkPassword(password);
  };

  const handleCancel = () => {
    setUserCancelled(true);
  };

  const renderContent = () => {
    const userExceedsMaxAttempts = attempt === maxAttempts;
    if (userExceedsMaxAttempts) {
      return renderMaxAttemptsContent();
    }
    if (userCancelled) {
      return renderUserCancelContent();
    }

    return renderEnterPasswordContent();
  };

  const renderMaxAttemptsContent = () => <p>{t('message.encryptedAttemptsExceeded')}</p>;

  const renderUserCancelContent = () => <p>{t('message.encryptedUserCancelled')}</p>;

  const renderEnterPasswordContent = () => {
    const wrongPassword = attempt !== 0;

    return (
      <div className="wrapper">
        <div className="header">{t('message.passwordRequired')}</div>
        <form onSubmit={handleSubmit}>
          <div className="enter">
            <div>{t('message.enterPassword')}</div>
            <input
              className={`${wrongPassword ? 'wrong' : 'correct'}`}
              type="password"
              ref={passwordInput}
              value={password}
              onChange={handleInputChange}
            />
          </div>
          {wrongPassword &&
            <div className="incorrect-password">
              {t('message.incorrectPassword', {
                remainingAttempts: maxAttempts - attempt,
              })}
            </div>
          }
          <div className="buttons">
            <Button
              dataElement="passwordSubmitButton"
              label={t('action.submit')}
              onClick={handleSubmit}
            />
            <Button
              dataElement="passwordCancelButton"
              label={t('action.cancel')}
              onClick={handleCancel}
            />
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className={getClassName('Modal PasswordModal', props)} data-element="passwordModal">
      <div className="container">
        {renderContent()}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isOpen: selectors.isElementOpen(state, 'passwordModal'),
  checkPassword: selectors.getCheckPasswordFunction(state),
  attempt: selectors.getPasswordAttempts(state),
});

const mapDispatchToProps = {
  setPasswordAttempts: actions.setPasswordAttempts,
  closeElement: actions.closeElement,
};

PasswordModal.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PasswordModal));