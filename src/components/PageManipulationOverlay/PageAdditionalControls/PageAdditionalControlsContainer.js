import React from 'react';
import PageAdditionalControls from './PageAdditionalControls';
import { movePagesToBottom, movePagesToTop, noPagesSelectedWarning } from "helpers/pageManipulationFunctions";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';

const propTypes = {
  pageIndexes: PropTypes.arrayOf(PropTypes.number),
  warn: PropTypes.bool,
};

function PageAdditionalControlsContainer(props) {
  const dispatch = useDispatch();
  const { pageNumbers, warn } = props;

  if (warn) {
    return (
      <PageAdditionalControls
        moveToTop={() => !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToTop(pageNumbers)}
        moveToBottom={() => !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToBottom(pageNumbers)}
      />
    );
  }
  return (
    <PageAdditionalControls
      moveToTop={() => movePagesToTop(pageNumbers)}
      moveToBottom={() => movePagesToBottom(pageNumbers)}
    />
  );
}

PageAdditionalControlsContainer.propTypes = propTypes;

export default PageAdditionalControlsContainer;