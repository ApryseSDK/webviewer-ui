import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import PageManipulationControls from './PageManipulationControls';
import { deletePages, extractPages, noPagesSelectedWarning, replace } from "helpers/pageManipulationFunctions";
import PropTypes from 'prop-types';

const propTypes = {
  pageNumbers: PropTypes.arrayOf(PropTypes.number),
  warn: PropTypes.bool,
};

function PageManipulationControlsContainer(props) {
  const dispatch = useDispatch();
  const { pageNumbers, warn } = props;
  const [isPageDeletionConfirmationModalEnabled] = useSelector(state => [
    selectors.pageDeletionConfirmationModalEnabled(state),
  ]);

  if (warn) {
    return (
      <PageManipulationControls
        deletePages={() => !noPagesSelectedWarning(pageNumbers, dispatch) && deletePages(pageNumbers, dispatch, isPageDeletionConfirmationModalEnabled)}
        extractPages={() => !noPagesSelectedWarning(pageNumbers, dispatch) && extractPages(pageNumbers, dispatch)}
        replacePages={() => !noPagesSelectedWarning(pageNumbers, dispatch) && replace()} // TODO: Integrate with replace
      />
    );
  }
  return (
    <PageManipulationControls
      deletePages={() => deletePages(pageNumbers, dispatch, isPageDeletionConfirmationModalEnabled)}
      extractPages={() => extractPages(pageNumbers, dispatch)}
      replacePages={() => replace()} // TODO: Integrate with replace
    />
  );
}

PageManipulationControlsContainer.propTypes = propTypes;

export default PageManipulationControlsContainer;