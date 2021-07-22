import React from 'react'
import { useSelector, shallowEqual } from 'react-redux';
import PageManipulationOverlay from './PageManipulationOverlay';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import selectors from 'selectors';


function PageManipulationOverlayContainer() {

  const [selectedPageIndexes, currentPage] = useSelector(state => [
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.getCurrentPage(state),
  ]);
  // If we start drilling this prop, maybe create a context
  const selectedPageNumbers = selectedPageIndexes.map(index => index + 1);
  const pageNumbers = selectedPageNumbers.length > 0 ? selectedPageNumbers : [currentPage];


  return (
    <FlyoutMenu menu='pageManipulationOverlay' trigger="pageManipulationOverlayButton" onClose={undefined}>
      <PageManipulationOverlay
        pageNumbers={pageNumbers}
      />
    </ FlyoutMenu>
  )
}

export default PageManipulationOverlayContainer;