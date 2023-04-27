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

import { Swipeable } from 'react-swipeable';

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
      selectors.isElementDisabled(state, 'warningModal'),
      selectors.isElementOpen(state, 'warningModal'),
      selectors.getShowAskAgainCheckbox(state),
    ],
    shallowEqual,
  );

  const [disableWarning, setDisableWarning] = useState(false);
  const dispatch = useDispatch();

  if (isDisabled) {
    return null;
  }

  const className = getClassName('Modal WarningModal', { isOpen });
  const label = i18next.t(confirmBtnText) || i18next.t('action.ok');

  useEffect(() => {
    core.addEventListener('documentUnloaded', cancel);

    return () => {
      core.removeEventListener('documentUnloaded', cancel);
    };
  }, []);

  const getMessageWithNewLine = () => {
    const messageIsAValidStringKey = typeof message === 'string' && i18next.exists(message);
    const translatedMessage = messageIsAValidStringKey ? i18next.t(message) : message;
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
      disableWarning && await dispatch(actions.disableDeleteTabWarning());
      dispatch(actions.closeElements(['warningModal']));
    }
  };

  return (
    <Swipeable onSwipedUp={cancel} onSwipedDown={cancel} preventDefaultTouchmoveEvent>
      <div className={className} onMouseDown={cancel}>
        <div className="container" onMouseDown={(e) => e.stopPropagation()}>
          <div className="swipe-indicator" />
          <div className="header">
            <div className="header-text">
              {i18next.t(title)}
            </div>
            <Button
              img="icon-close"
              onClick={cancel}
              dataElement="closeModalButton"
              title="action.cancel"
            />
          </div>
          <div className="divider" />
          <div className="body">
            {getMessageWithNewLine()}
          </div>
          <div className="divider" />
          <div className="footer">
            {
              showAskAgainCheckbox && (
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
              )
            }
            {onSecondary && (
              <Button
                className={classNames({
                  'modal-button': true,
                  [secondaryBtnClass]: secondaryBtnClass,
                })}
                dataElement="WarningModalClearButton"
                label={i18next.t(secondaryBtnText)}
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
    </Swipeable>
  );
};

export default WarningModal;
