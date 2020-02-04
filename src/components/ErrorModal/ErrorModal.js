import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import actions from 'actions';
import selectors from 'selectors';

import './ErrorModal.scss';

const ErrorModal = () => {
  const [message, isDisabled, isOpen] = useSelector(
    state => [
      selectors.getErrorMessage(state),
      selectors.isElementDisabled(state, 'errorModal'),
      selectors.isElementOpen(state, 'errorModal'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [t] = useTranslation();

  useEffect(() => {
    if (isOpen) {
      dispatch(
        actions.closeElements([
          'signatureModal',
          'printModal',
          'loadingModal',
          'progressModal',
        ]),
      );
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    const onError = error => {
      error = (error.detail && (error.detail.message || error.detail)) || error.message;
      let errorMessage;

      if (typeof error === 'string') {
        errorMessage = error;

        // provide a more specific error message
        if (errorMessage.indexOf('File does not exist') > -1) {
          errorMessage = t('message.notSupported');
        }
      } else if (error?.type === 'InvalidPDF') {
        errorMessage = t('message.badDocument');
      }

      if (errorMessage) {
        dispatch(actions.showErrorMessage(errorMessage));
      }
    };

    window.addEventListener('loaderror', onError);
    return () => window.removeEventListener('loaderror', onError);
  }, [dispatch, t]);

  return isDisabled ? null : (
    <div
      className={classNames({
        Modal: true,
        ErrorModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element="errorModal"
    >
      <div className="container">{message}</div>
    </div>
  );
};

export default ErrorModal;
