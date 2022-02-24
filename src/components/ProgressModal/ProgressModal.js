import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import actions from "actions";
import selectors from "selectors";

import "./ProgressModal.scss";

const ProgressModal = () => {
  const [isDisabled, isOpen, loadingProgress] = useSelector(
    state => [
      selectors.isElementDisabled(state, "progressModal"),
      selectors.isElementOpen(state, "progressModal"),
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
          "signatureModal",
          "printModal",
          "errorModal",
          "loadingModal",
          "passwordModal",
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
      data-element="progressModal"
    >
      <div className="container">
        <svg className="progress-ring" width="52" height="52">
          <circle
            className="progress-ring__fill"
            r="22"
            cx="26"
            cy="26"
          />
          <circle
            ref={progressCircle}
            className="progress-ring__circle"
            r="22"
            cx="26"
            cy="26"
          />
        </svg>
        <div className="msg">Processing...</div>
      </div>
    </div>
  );
};

export default ProgressModal;
