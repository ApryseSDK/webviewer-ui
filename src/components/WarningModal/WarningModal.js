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
import { Swipeable } from 'react-swipeable';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';

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

  const cancel = async () => {
    onCancel && await onCancel();
    closeModal();
  };

  const confirm = async () => {
    onConfirm && await onConfirm();
    closeModal();
  };

  const secondary = async () => {
    onSecondary && await onSecondary();
    closeModal();
  };

  const closeModal = async () => {
    if (isOpen) {
      onClose && await onClose(disableWarning);
      dispatch(actions.closeElements(DataElements.WARNING_MODAL));
    }
  };

  return isDisabled ? null : (
    <Swipeable onSwipedUp={cancel} onSwipedDown={cancel} preventDefaultTouchmoveEvent>
      <FocusTrap locked={isOpen}>
        <div
          className={className}
          onMouseDown={cancel}
          role="alertdialog"
          aria-modal="true"
          aria-label={i18next.t(title, templateStrings)}
          aria-describedby={i18next.t(title, templateStrings)}
        >
          <div className="container" onMouseDown={(e) => e.stopPropagation()}>
            <div className="swipe-indicator" />
            <div className="header">
              <div className="header-text">
                <h2 aria-hidden="true">{i18next.t(title, templateStrings)}</h2>
              </div>
              <Button
                img="icon-close"
                onClick={cancel}
                dataElement="closeModalButton"
                title="action.cancel"
              />
            </div>
            <div className="divider" />
            <div className="body" aria-hidden="true">
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
        </div>
      </FocusTrap>
    </Swipeable>
  );
};

export default WarningModal;
