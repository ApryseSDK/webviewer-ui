import React, { useEffect } from 'react';
import classNames from 'classnames';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import actions from 'actions';
import selectors from 'selectors';

import './ErrorModal.scss';

const ErrorModal = () => {
  const [message, isDisabled, isOpen, isMultiTab] = useSelector(
    state => [
      selectors.getErrorMessage(state),
      selectors.isElementDisabled(state, 'errorModal'),
      selectors.isElementOpen(state, 'errorModal'),
      selectors.getIsMultiTab(state),
    ],
    shallowEqual
  );
  const dispatch = useDispatch();
  const [t] = useTranslation();

  useEffect(() => {
    if (isOpen) {
      dispatch(
        actions.closeElements(['signatureModal', 'printModal', 'loadingModal', 'progressModal', 'passwordModal', 'filterModal'])
      );
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    const onError = error => {
      error = error.detail?.message || error.detail || error.message;

      let errorMessage;

      if (typeof error === 'string') {
        errorMessage = error;

        // provide a more specific error message
        if (errorMessage.includes('File does not exist')) {
          errorMessage = 'message.notSupported';
        }
      } else if (error?.type === 'InvalidPDF') {
        errorMessage = 'message.badDocument';
      }

      if (errorMessage) {
        dispatch(actions.showErrorMessage(errorMessage));
      }
    };

    window.addEventListener('loaderror', onError);
    return () => window.removeEventListener('loaderror', onError);
  }, [dispatch]);

  const shouldTranslate = message.startsWith('message.');

  let tabsPadding = 0;
  if (isMultiTab) {
    // Add tabsheader padding
    tabsPadding += document.getElementsByClassName("TabsHeader")[0]?.getBoundingClientRect().bottom;
  }

  return isDisabled ? null : (
    <div
      className={classNames({
        Modal: true,
        ErrorModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
      style={isMultiTab ? { height: `calc(100% - ${tabsPadding}px)` } : undefined}
      data-element="errorModal"
    >
      <div className="container">{shouldTranslate ? t(message) : message}</div>
    </div>
  );
};

export default ErrorModal;
