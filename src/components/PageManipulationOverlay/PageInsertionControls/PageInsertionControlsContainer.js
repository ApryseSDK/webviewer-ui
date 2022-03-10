import React from 'react';
import PageInsertionControls from './PageInsertionControls';
import { insertAbove, insertBelow, noPagesSelectedWarning } from "helpers/pageManipulationFunctions";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import actions from 'actions';
import { isMobile } from 'helpers/device';

const propTypes = {
  pageNumbers: PropTypes.arrayOf(PropTypes.number),
  warn: PropTypes.bool,
};

function PageInsertionControlsContainer(props) {
  const dispatch = useDispatch();
  const { pageNumbers, warn } = props;

  const onInsertAbove = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && insertAbove(pageNumbers);
    } else {
      insertAbove(pageNumbers);
    }
    isMobile() && dispatch(actions.closeElement("pageManipulationOverlay"));
  };
  const onInsertBelow = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && insertBelow(pageNumbers);
    } else {
      insertBelow(pageNumbers);
    }
    isMobile() && dispatch(actions.closeElement("pageManipulationOverlay"));
  };
  return (
    <PageInsertionControls
      insertAbove={onInsertAbove}
      insertBelow={onInsertBelow}
    />
  );
}

PageInsertionControlsContainer.propTypes = propTypes;

export default PageInsertionControlsContainer;