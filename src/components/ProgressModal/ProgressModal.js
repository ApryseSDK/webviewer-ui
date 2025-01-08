import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';

import './ProgressModal.scss';

const ProgressModal = () => {
  const [isDisabled, isOpen, loadingProgress] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.PROGRESS_MODAL),
      selectors.isElementOpen(state, DataElements.PROGRESS_MODAL),
      selectors.getLoadingProgress(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const progressCircle = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(
        actions.closeElements([
          DataElements.SIGNATURE_MODAL,
          DataElements.PRINT_MODAL,
          DataElements.LOADING_MODAL,
          DataElements.ERROR_MODAL,
          DataElements.PASSWORD_MODAL,
          DataElements.SAVE_MODAL,
          DataElements.OPEN_FILE_MODAL,
          DataElements.WARNING_MODAL,
          DataElements.COLOR_PICKER_MODAL,
          DataElements.SCALE_MODAL,
          DataElements.SETTINGS_MODAL,
          DataElements.CREATE_PORTFOLIO_MODAL,
          DataElements.CUSTOM_STAMP_MODAL,
          DataElements.INSERT_PAGE_MODAL,
          DataElements.PAGE_REPLACEMENT_MODAL,
          DataElements.PAGE_REDACT_MODAL,
          DataElements.SIGNATURE_VALIDATION_MODAL,
          DataElements.FILTER_MODAL,
          DataElements.LINK_MODAL
        ]),
      );
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    const circle = progressCircle.current;

    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - loadingProgress * circumference;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset;
    }
  }, [loadingProgress]);

  return isDisabled ? null : (
    <div
      className={classNames({
        Modal: true,
        ProgressModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element={DataElements.PROGRESS_MODAL}
    >
      <div className="container">
        <svg className="progress-ring" width="54" height="54">
          <circle
            className="progress-ring__fill"
            r="25"
            cx="27"
            cy="27"
          />
          <circle
            ref={progressCircle}
            className="progress-ring__circle"
            r="25"
            cx="27"
            cy="27"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProgressModal;
