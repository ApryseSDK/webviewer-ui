import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import i18next from 'i18next';
import core from 'core';

import Button from 'components/Button';

import getClassName from 'helpers/getClassName';

import actions from 'actions';
import selectors from 'selectors';

import { Swipeable } from 'react-swipeable';

import './WarningModal.scss';

const WarningModal = () => {
  const [
    title,
    message,
    onConfirm,
    confirmBtnText,
    onSecondary,
    secondaryBtnText,
    onCancel,
    isDisabled,
    isOpen,
  ] = useSelector(
    state => [
      selectors.getWarningTitle(state) || '',
      selectors.getWarningMessage(state),
      selectors.getWarningConfirmEvent(state),
      selectors.getWarningConfirmBtnText(state),
      selectors.getWarningSecondaryEvent(state),
      selectors.getWarningSecondaryBtnText(state),
      selectors.getWarningCancelEvent(state),
      selectors.isElementDisabled(state, 'warningModal'),
      selectors.isElementOpen(state, 'warningModal'),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();

  if (isDisabled) {
    return null;
  }

  const className = getClassName('Modal WarningModal', { isOpen });
  const label = confirmBtnText || i18next.t('action.ok');

  useEffect(() => {
    core.addEventListener('documentUnloaded', cancel);

    return () => {
      core.removeEventListener('documentUnloaded', cancel);
    };
  }, []);

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

  const closeModal = () => dispatch(actions.closeElements(['warningModal']));

  return (
    <Swipeable onSwipedUp={cancel} onSwipedDown={cancel} preventDefaultTouchmoveEvent>
      <div className={className} onMouseDown={cancel}>
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <div className="swipe-indicator" />
          <div className="header">
            <div className="header-text">
              {title}
            </div>
            <Button
              img="icon-close"
              onClick={cancel}
              dataElement="closeModalButton"
              title="action.cancel"
            />
          </div>
          <div className="divider"/>
          <div className="body">{message}</div>
          <div className="divider"/>
          <div className="footer">
            {onSecondary && (
              <Button
                className="confirm modal-button"
                dataElement="WarningModalClearButton"
                label={secondaryBtnText}
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
