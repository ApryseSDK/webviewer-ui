import React from 'react';
import PageInsertionControls from './PageInsertionControls';
import { insertAbove, insertBelow, noPagesSelectedWarning } from "helpers/pageManipulationFunctions";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';

const propTypes = {
  pageNumbers: PropTypes.arrayOf(PropTypes.number),
  warn: PropTypes.bool,
};

function PageInsertionControlsContainer(props) {
  const dispatch = useDispatch();
  const { pageNumbers, warn } = props;

  if (warn) {
    return (
      <PageInsertionControls
        insertAbove={() => !noPagesSelectedWarning(pageNumbers, dispatch) && insertAbove(pageNumbers)}
        insertBelow={() => !noPagesSelectedWarning(pageNumbers, dispatch) && insertBelow(pageNumbers)}
      />
    );
  }
  return (
    <PageInsertionControls
      insertAbove={() => insertAbove(pageNumbers)}
      insertBelow={() => insertBelow(pageNumbers)}
    />
  );
}

PageInsertionControlsContainer.propTypes = propTypes;

export default PageInsertionControlsContainer;