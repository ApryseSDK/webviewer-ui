import React from 'react';
import PageRotationControls from './PageRotationControls';
import { noPagesSelectedWarning, rotateClockwise, rotateCounterClockwise } from 'helpers/pageManipulationFunctions';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import actions from 'actions';
import { isMobile } from 'helpers/device';

const propTypes = {
  pageNumbers: PropTypes.arrayOf(PropTypes.number),
  warn: PropTypes.bool,
};

function PageRotationControlsContainer(props) {
  const dispatch = useDispatch();
  const { pageNumbers, warn } = props;

  const onRotateCounterClockwise = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && rotateCounterClockwise(pageNumbers);
    } else {
      rotateCounterClockwise(pageNumbers);
    }
    isMobile() && dispatch(actions.closeElement('pageManipulationOverlay'));
  };
  const onRotateClockwise = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && rotateClockwise(pageNumbers);
    } else {
      rotateClockwise(pageNumbers);
    }
    isMobile() && dispatch(actions.closeElement('pageManipulationOverlay'));
  };
  return (
    <PageRotationControls
      rotateCounterClockwise={onRotateCounterClockwise}
      rotateClockwise={onRotateClockwise}
    />
  );
}

PageRotationControlsContainer.propTypes = propTypes;

export default PageRotationControlsContainer;