import React from 'react';
import PageAdditionalControls from './PageAdditionalControls';
import { movePagesToBottom, movePagesToTop, noPagesSelectedWarning } from "helpers/pageManipulationFunctions";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import actions from 'actions';
import { isMobile } from 'helpers/device';

const propTypes = {
  pageIndexes: PropTypes.arrayOf(PropTypes.number),
  warn: PropTypes.bool,
};

function PageAdditionalControlsContainer(props) {
  const dispatch = useDispatch();
  const { pageNumbers, warn } = props;

  const moveToTop = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToTop(pageNumbers);
    } else {
      movePagesToTop(pageNumbers);
    }
    isMobile() && dispatch(actions.closeElement("pageManipulationOverlay"));
  };
  const moveToBottom = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToBottom(pageNumbers);
    } else {
      movePagesToBottom(pageNumbers);
    }
    isMobile() && dispatch(actions.closeElement("pageManipulationOverlay"));
  };
  return (
    <PageAdditionalControls
      moveToTop={moveToTop}
      moveToBottom={moveToBottom}
    />
  );
}

PageAdditionalControlsContainer.propTypes = propTypes;

export default PageAdditionalControlsContainer;