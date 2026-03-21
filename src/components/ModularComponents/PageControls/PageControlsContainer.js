import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line custom/use-core-hook-in-components
import selectors from 'selectors';
import actions from 'actions';
import sizeManager from 'helpers/responsivenessHelper';
import { getEndFacingChevronIcon, getStartFacingChevronIcon } from 'helpers/rightToLeft';
import PageControls from './PageControls';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FLYOUT_ITEM_TYPES, ITEM_TYPE, PLACEMENT, OPACITY_LEVELS } from 'constants/customizationVariables';
import DataElements from 'constants/dataElement';
import useCore from 'src/hooks/useCore';

const PageControlsContainer = ({ dataElement = 'page-controls-container', headerPlacement, headerDirection, className }) => {
  const size = useSelector((state) => selectors.getCustomElementSize(state, dataElement));
  const shouldFadePageNavigationComponent = useSelector(selectors.shouldFadePageNavigationComponent);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { core } = useCore();
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const totalPages = useSelector((state) => selectors.getTotalPages(state, activeDocumentViewerKey));
  const currentPage = useSelector((state) => selectors.getCurrentPage(state, activeDocumentViewerKey));
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const elementRef = useRef();

  useEffect(() => {
    sizeManager[dataElement] = {
      ...(sizeManager[dataElement] ? sizeManager[dataElement] : {}),
      canGrow: size === 1,
      canShrink: size === 0,
      grow: () => {
        dispatch(actions.setCustomElementSize(dataElement, 0));
      },
      shrink: () => {
        dispatch(actions.setCustomElementSize(dataElement, 1));
      },
      size: size,
    };
    if (elementRef.current) {
      sizeManager[dataElement].sizeToWidth = {
        ...(sizeManager[dataElement].sizeToWidth ? sizeManager[dataElement].sizeToWidth : {}),
        [size]: elementRef.current.clientWidth,
      };
      sizeManager[dataElement].sizeToHeight = {
        ...(sizeManager[dataElement].sizeToHeight ? sizeManager[dataElement].sizeToHeight : {}),
        [size]: elementRef.current.clientHeight,
      };
    }
  }, [size]);

  useEffect(() => {
    const pageControlsFlyout = {
      dataElement: 'pageControlsFlyout',
      className: 'pageControlsFlyout',
      items: [
        {
          dataElement: FLYOUT_ITEM_TYPES.PAGE_NAVIGATION_INPUT,
          totalPages,
          type: FLYOUT_ITEM_TYPES.PAGE_NAVIGATION_INPUT,
        },
        previousPageButton,
        nextPageButton
      ]
    };

    dispatch(actions.updateFlyout(pageControlsFlyout.dataElement, pageControlsFlyout));
  }, [totalPages, currentPage]);

  useEffect(() => {
    if (size === 0) {
      dispatch(actions.closeElement('pageControlsFlyout'));
    }
  }, [size]);

  useEffect(() => {
    if (!shouldFadePageNavigationComponent) {
      dispatch(actions.setOpacityOfItem(DataElements.PAGE_NAV_FLOATING_HEADER, OPACITY_LEVELS.FULL));
    }
    dispatch(actions.disableElement('pageNavOverlay'));
  }, []);

  const previousPageButton = {
    onClick: () => {
      if (currentPage - 1 > 0) {
        core.setCurrentPage(Math.max(currentPage - 1, 1), activeDocumentViewerKey);
      }
    },
    dataElement: DataElements.PREVIOUS_PAGE_BUTTON,
    title: isFirstPage ? null : t('action.pagePrev'),
    label: size === 1 ? t('action.pagePrev') : null,
    headerPlacement,
    img: headerPlacement === PLACEMENT.LEFT ? 'icon-chevron-up' : getStartFacingChevronIcon(),
    type: ITEM_TYPE.PAGE_NAVIGATION_BUTTON,
    disabled: isFirstPage,
    ariaLabel: t('action.pagePrev'),
  };

  const nextPageButton = {
    onClick: () => {
      if (currentPage + 1 <= totalPages) {
        core.setCurrentPage(Math.min(currentPage + 1, totalPages), activeDocumentViewerKey);
      }
    },
    dataElement: DataElements.NEXT_PAGE_BUTTON,
    title: isLastPage ? null : t('action.pageNext'),
    label: size === 1 ? t('action.pageNext') : null,
    headerPlacement,
    img: headerPlacement === PLACEMENT.LEFT ? 'icon-chevron-down' : getEndFacingChevronIcon(),
    type: ITEM_TYPE.PAGE_NAVIGATION_BUTTON,
    disabled: isLastPage,
    ariaLabel: t('action.pageNext'),
  };

  const onFlyoutToggle = () => {
    const dataElement = elementRef.current.getAttribute('data-element');
    dispatch(actions.setFlyoutToggleElement(dataElement));
  };

  return (
    <PageControls
      size={size}
      headerDirection={headerDirection}
      elementRef={elementRef}
      previousPageButton={previousPageButton}
      nextPageButton={nextPageButton}
      dataElement={dataElement}
      onFlyoutToggle={onFlyoutToggle}
      className={className}
    />
  );
};

PageControlsContainer.propTypes = {
  dataElement: PropTypes.string.isRequired,
  headerPlacement: PropTypes.string,
  headerDirection: PropTypes.string,
  className: PropTypes.string,
};

export default PageControlsContainer;
