import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import i18next from 'i18next';
import core from 'core';
import Button from 'components/Button';
import Choice from 'components/Choice/Choice';
import getClassName from 'helpers/getClassName';
import classNames from 'classnames';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import ModalWrapper from 'components/ModalWrapper';
import useFocusOnClose from 'hooks/useFocusOnClose';

import './WarningModal.scss';

const WarningModal = () => {
  const doNotAskCheckboxRef = React.createRef();

  const [
    title,
    message,
    onConfirm,
    confirmBtnText,
    onSecondary,
    secondaryBtnText,
    secondaryBtnClass,
    onCancel,
    isDisabled,
    isOpen,
    showAskAgainCheckbox,
    templateStrings,
    warningModalClass,
    onClose,
  ] = useSelector(
    (state) => [
      selectors.getWarningTitle(state) || '',
      selectors.getWarningMessage(state),
      selectors.getWarningConfirmEvent(state),
      selectors.getWarningConfirmBtnText(state),
      selectors.getWarningSecondaryEvent(state),
      selectors.getWarningSecondaryBtnText(state),
      selectors.getWarningSecondaryBtnClass(state),
      selectors.getWarningCancelEvent(state),
      selectors.isElementDisabled(state, DataElements.WARNING_MODAL),
      selectors.isElementOpen(state, DataElements.WARNING_MODAL),
      selectors.getShowAskAgainCheckbox(state),
      selectors.getWarningTemplateStrings(state) || {},
      selectors.getWarningModalClass(state) || '',
      selectors.getWarningCloseEvent(state) || '',
    ],
    shallowEqual,
  );

  const [disableWarning, setDisableWarning] = useState(false);
  const dispatch = useDispatch();

  const className = getClassName(`Modal WarningModal ${warningModalClass}`, { isOpen });
  const label = i18next.t(confirmBtnText, templateStrings) || i18next.t('action.ok');

  useEffect(() => {
    core.addEventListener('documentUnloaded', cancel);

    return () => {
      core.removeEventListener('documentUnloaded', cancel);
    };
  }, []);

  // Reset disableWarning state
  useEffect(() => {
    if (isOpen) {
      setDisableWarning(false);
    }
  }, [isOpen]);

  const getMessageWithNewLine = () => {
    const messageIsAValidStringKey = typeof message === 'string' && i18next.exists(message);
    const translatedMessage = messageIsAValidStringKey ? i18next.t(message, templateStrings) : message;
    if (translatedMessage.includes?.('\n')) {
      return translatedMessage.split('\n').map((str, index) => (
        <React.Fragment key={index}>
          {index === 0
            ? <>{str}</>
            : <><br />{str}</>
          }
        </React.Fragment>
      ));
    }
    return translatedMessage;
  };

  const closeModal = async () => {
    if (isOpen) {
      onClose && await onClose(disableWarning);
      dispatch(actions.closeElements(DataElements.WARNING_MODAL));
    }
  };

  const closeWithFocusTransfer = useFocusOnClose(closeModal);

  const cancel = async () => {
    onCancel && await onCancel();
    closeWithFocusTransfer();
  };

  const confirm = async (e) => {
    onConfirm && await onConfirm(e);
    closeWithFocusTransfer();
  };

  const secondary = async () => {
    onSecondary && await onSecondary();
    closeWithFocusTransfer();
  };

  return isDisabled ? null : (
    <div
      className={className}
      onMouseDown={cancel}
      role="alertdialog"
      aria-modal="true"
      aria-label={i18next.t(title, templateStrings)}
      aria-describedby={i18next.t(title, templateStrings)}
    >
      <ModalWrapper
        title={i18next.t(title, templateStrings)}
        isOpen={isOpen}
        closeHandler={cancel}
        onCloseClick={cancel}
        swipeToClose>
        <div className="container" onMouseDown={(e) => e.stopPropagation()}>
          <div className="body">
            {getMessageWithNewLine()}
          </div>
          <div className="divider" />
          <div className="footer">
            {showAskAgainCheckbox && (
              <Choice
                dataElement="doNotAskAgainCheckbox"
                ref={doNotAskCheckboxRef}
                id="do-not-ask-again-checkbox"
                name="do-not-ask-again-checkbox"
                label={i18next.t('message.doNotAskAgain')}
                onChange={(e) => setDisableWarning(e.target.checked)}
                checked={disableWarning}
                center
              />

            )}
            {onSecondary && (
              <Button
                className={classNames({
                  'modal-button': true,
                  'second-option-button': true,
                  [secondaryBtnClass]: secondaryBtnClass,
                })}
                dataElement="WarningModalClearButton"
                label={i18next.t(secondaryBtnText, templateStrings)}
                onClick={secondary}
              />
            )}
            <Button
              className="confirm modal-button"
              dataElement="WarningModalSignButton"
              label={label}
              onClick={confirm}
            />
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default WarningModal;