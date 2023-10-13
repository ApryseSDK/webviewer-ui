import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PageManipulationOverlay from './PageManipulationOverlay';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { useTranslation } from 'react-i18next';

function PageManipulationOverlayContainer() {
  const [
    selectedPageIndexes,
    currentPage,
    pageManipulationOverlayItems,
  ] = useSelector((state) => [
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.getCurrentPage(state),
    selectors.getPageManipulationOverlayItems(state),
  ], shallowEqual);

  // If we start drilling this prop, maybe create a context
  const pageNumbers = selectedPageIndexes.length > 0 ? selectedPageIndexes.map((i) => i + 1) : [currentPage];

  const [t] = useTranslation();

  return (
    <FlyoutMenu
      menu={DataElements.PAGE_MANIPULATION_OVERLAY}
      trigger={DataElements.PAGE_MANIPULATION_OVERLAY_BUTTON}
      ariaLabel={t('option.thumbnailPanel.moreOptionsMenu')}
    >
      <span className="visually-hidden">
        <p aria-live="assertive" role="alert"> {t('option.thumbnailPanel.moreOptionsMenu')}</p>
      </span>
      <PageManipulationOverlay
        pageNumbers={pageNumbers}
        pageManipulationOverlayItems={pageManipulationOverlayItems}
      />
    </ FlyoutMenu>
  );
}

export default PageManipulationOverlayContainer;