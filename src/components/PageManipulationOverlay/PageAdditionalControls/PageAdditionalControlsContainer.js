import React from 'react';
import PageAdditionalControls from './PageAdditionalControls';
import { movePagesToBottom, movePagesToTop, noPagesSelectedWarning } from 'helpers/pageManipulationFunctions';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import actions from 'actions';
import { isMobile } from 'helpers/device';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';

const propTypes = {
  pageNumbers: PropTypes.arrayOf(PropTypes.number),
  warn: PropTypes.bool,
};

function PageAdditionalControlsContainer(props) {
  const dispatch = useDispatch();
  const { pageNumbers, warn } = props;
  const documentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  const moveToTop = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToTop(pageNumbers, documentViewerKey);
    } else {
      movePagesToTop(pageNumbers, documentViewerKey);
    }
    isMobile() && dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION_OVERLAY));
  };
  const moveToBottom = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToBottom(pageNumbers, documentViewerKey);
    } else {
      movePagesToBottom(pageNumbers, documentViewerKey);
    }
    isMobile() && dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION_OVERLAY));
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