import React, { useEffect } from 'react';
import classNames from 'classnames';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import actions from 'actions';
import selectors from 'selectors';
import Button from 'components/Button';
import { escapePressListener } from 'helpers/accessibility';
import ModalWrapper from '../ModalWrapper';
import DataElements from 'constants/dataElement';

import './ErrorModal.scss';

const ErrorModal = () => {
  const [message, title, isDisabled, isOpen] = useSelector(
    (state) => [
      selectors.getErrorMessage(state),
      selectors.getErrorTitle(state),
      selectors.isElementDisabled(state, DataElements.ERROR_MODAL),
      selectors.isElementOpen(state, DataElements.ERROR_MODAL),
    ],
    shallowEqual
  );
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const isTrialError = (message) => {
    return message?.includes('dev.apryse.com');
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(
        actions.closeElements([
          DataElements.SIGNATURE_MODAL,
          DataElements.PRINT_MODAL,
          DataElements.LOADING_MODAL,
          DataElements.PROGRESS_MODAL,
          DataElements.PASSWORD_MODAL,
          DataElements.FILTER_MODAL
        ])
      );

      window.addEventListener('keydown', (e) => escapePressListener(e, closeErrorModal));
      return () => window.removeEventListener('keydown', escapePressListener);
    }
  }, [dispatch, isOpen]);

  const shouldTranslate = message.startsWith('message.');

  const closeErrorModal = () => {
    dispatch(actions.closeElement(DataElements.ERROR_MODAL));
    if (isTrialError(message)) {
      window.open('https://dev.apryse.com', '_blank');
    }
  };

  let buttonLabel = t('action.ok');

  if (isTrialError(message)) {
    buttonLabel = 'Get trial key';
  }

  return isDisabled ? null : (
    <div
      className={classNames({
        Modal: true,
        ErrorModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element={DataElements.ERROR_MODAL}
    >
      <ModalWrapper isOpen={isOpen} title={title || 'message.error'}
        closeButtonDataElement={'errorModalCloseButton'}
        onCloseClick={closeErrorModal}
      >
        <div className="modal-content error-modal-content">
          <p>{shouldTranslate ? t(message) : message}</p>
        </div>
        <div className="modal-footer footer">
          <Button
            className="confirm modal-button"
            dataElement="closeErrorModalButton"
            label={buttonLabel}
            onClick={closeErrorModal}
          />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default ErrorModal;
