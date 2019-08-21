import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import actions from 'actions';
import selectors from 'selectors';

import './ErrorModal.scss';

const ErrorModal = () => {
  const [message, isDisabled, isOpen, documentPath] = useSelector(
    state => [
      selectors.getErrorMessage(state),
      selectors.isElementDisabled(state, 'errorModal'),
      selectors.isElementOpen(state, 'errorModal'),
      selectors.getDocumentPath(state),
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
      if (documentPath.indexOf('file:///') > -1) {
        console.error(
          `WebViewer doesn't have access to file URLs because of browser security restrictions. Please see https://www.pdftron.com/documentation/web/guides/basics/troubleshooting-document-loading#not-allowed-to-load-local-resource:-file:`,
        );
      }

      error = error.detail || error.message;
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
  }, [dispatch, documentPath, t]);

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
