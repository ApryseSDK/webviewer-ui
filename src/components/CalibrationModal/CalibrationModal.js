import React from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';

import actions from 'actions';
import selectors from 'selectors';

import './CalibrationModal.scss';

const CalibrationModal = () => {
  const isOpen = useSelector(state =>
    selectors.isElementOpen(state, 'calibrationModal'),
  );
  const dispatch = useDispatch();
  const [t] = useTranslation();

  return (
    <div
      className={classNames({
        Modal: true,
        CalibrationModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
    >
      <div className="container">Hello</div>
    </div>
  );
};

export default CalibrationModal;
