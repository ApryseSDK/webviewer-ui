import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import PageManipulationControls from './PageManipulationControls';
import { deletePages, extractPages, noPagesSelectedWarning, replace } from 'helpers/pageManipulationFunctions';
import PropTypes from 'prop-types';
import actions from 'actions';
import { isMobile } from 'helpers/device';

const propTypes = {
  pageNumbers: PropTypes.arrayOf(PropTypes.number),
  warn: PropTypes.bool,
};

function PageManipulationControlsContainer(props) {
  const dispatch = useDispatch();
  const { pageNumbers, warn } = props;
  const [isPageDeletionConfirmationModalEnabled] = useSelector((state) => [
    selectors.pageDeletionConfirmationModalEnabled(state),
  ]);

  const openInsertPageModal = () => {
    dispatch(actions.closeElement('pageManipulationOverlay'));
    dispatch(actions.openElement('insertPageModal'));
  };

  const onInsert = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && openInsertPageModal();
    } else {
      openInsertPageModal();
    }
    isMobile() && dispatch(actions.closeElement('pageManipulationOverlay'));
  };

  const onReplace = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && replace(dispatch);
    } else {
      replace(dispatch);
    }
    isMobile() && dispatch(actions.closeElement('pageManipulationOverlay'));
  };
  const onExtract = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && extractPages(pageNumbers, dispatch);
    } else {
      extractPages(pageNumbers, dispatch);
    }
    isMobile() && dispatch(actions.closeElement('pageManipulationOverlay'));
  };
  const onDelete = () => {
    if (warn) {
      !noPagesSelectedWarning(pageNumbers, dispatch) && deletePages(pageNumbers, dispatch, isPageDeletionConfirmationModalEnabled);
    } else {
      deletePages(pageNumbers, dispatch, isPageDeletionConfirmationModalEnabled);
    }
    isMobile() && dispatch(actions.closeElement('pageManipulationOverlay'));
  };

  return (
    <PageManipulationControls
      insertPages={onInsert}
      deletePages={onDelete}
      extractPages={onExtract}
      replacePages={onReplace}
    />
  );
}

PageManipulationControlsContainer.propTypes = propTypes;

export default PageManipulationControlsContainer;