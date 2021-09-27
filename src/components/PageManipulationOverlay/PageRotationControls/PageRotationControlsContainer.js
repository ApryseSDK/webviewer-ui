import React from 'react';
import PageRotationControls from './PageRotationControls';
import { noPagesSelectedWarning, rotateClockwise, rotateCounterClockwise } from "helpers/pageManipulationFunctions";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';

const propTypes = {
  pageNumbers: PropTypes.arrayOf(PropTypes.number),
  warn: PropTypes.bool,
};

function PageRotationControlsContainer(props) {
  const dispatch = useDispatch();
  const { pageNumbers, warn } = props;

  if (warn) {
    return (
      <PageRotationControls
        rotateClockwise={() => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateClockwise(pageNumbers)}
        rotateCounterClockwise={() => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateCounterClockwise(pageNumbers)}
      />
    );
  }
  return (
    <PageRotationControls
      rotateClockwise={() => rotateClockwise(pageNumbers)}
      rotateCounterClockwise={() => rotateCounterClockwise(pageNumbers)}
    />
  );
}

PageRotationControlsContainer.propTypes = propTypes;

export default PageRotationControlsContainer;