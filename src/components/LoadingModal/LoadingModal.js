import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';

import './LoadingModal.scss';

const LoadingModal = () => {
  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.LOADING_MODAL), shallowEqual);
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.LOADING_MODAL), shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements([
        DataElements.SIGNATURE_MODAL,
        DataElements.PRINT_MODAL,
        DataElements.ERROR_MODAL,
      ]));
    }
  }, [isOpen]);

  if (isDisabled) {
    return null;
  }

  return (
    <div
      className={classNames({
        'Modal': true,
        'LoadingModal': true,
        'open': isOpen,
      })}
      data-element={DataElements.LOADING_MODAL}
    >
      <div className="container">
        <div className="inner-wrapper"></div>
      </div>
    </div>
  );
};

export default LoadingModal;