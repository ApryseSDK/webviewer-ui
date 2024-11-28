import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import sizeManager from 'helpers/responsivenessHelper';
import PageControls from './PageControls';
import useDidUpdate from 'hooks/useDidUpdate';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FLYOUT_ITEM_TYPES, ITEM_TYPE, PLACEMENT, OPACITY_LEVELS } from 'constants/customizationVariables';
import DataElements from 'constants/dataElement';

const PageControlsContainer = ({ dataElement = 'page-controls-container', headerPlacement, headerDirection }) => {

  const currentFlyout = useSelector((state) => selectors.getFlyout(state, DataElements.PAGE_CONTROLS_FLYOUT), shallowEqual);
  const size = useSelector((state) => selectors.getCustomElementSize(state, dataElement));
  const totalPages = useSelector(selectors.getTotalPages);
  const currentPage = useSelector(selectors.getCurrentPage);
  const shouldFadePageNavigationComponent = useSelector(selectors.shouldFadePageNavigationComponent);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isFirstPage, setIsFirstPage] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
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
      items: [{
        dataElement: FLYOUT_ITEM_TYPES.PAGE_NAVIGATION_INPUT,
        totalPages,
      }, previousPageButton, nextPageButton]
    };

    if (!currentFlyout && size === 1) {
      dispatch(actions.addFlyout(pageControlsFlyout));
    } else if (size === 1) {
      dispatch(actions.updateFlyout(pageControlsFlyout.dataElement, pageControlsFlyout));
    } else if (currentFlyout && size === 0) {
      dispatch(actions.removeFlyout(pageControlsFlyout.dataElement));
    }
  }, [size, totalPages, currentPage]);

  useEffect(() => {
    if (!shouldFadePageNavigationComponent) {
      dispatch(actions.setOpacityOfItem(DataElements.PAGE_NAV_FLOATING_HEADER, OPACITY_LEVELS.FULL));
    }
    dispatch(actions.disableElement('pageNavOverlay'));
  }, []);

  useDidUpdate(() => {
    const documentViewer = core.getDocumentViewer();
    setIsFirstPage(documentViewer.getCurrentPage() === 1);
    setIsLastPage(documentViewer.getCurrentPage() === documentViewer.getPageCount());
  }, [currentPage, totalPages]);

  const previousPageButton = {
    onClick: () => {
      if (core.getCurrentPage() - 1 > 0) {
        core.setCurrentPage(Math.max(core.getCurrentPage() - 1, 1));
      }
    },
    dataElement: DataElements.PREVIOUS_PAGE_BUTTON,
    title: isFirstPage ? null : t('action.pagePrev'),
    label: size === 1 ? t('action.pagePrev') : null,
    headerPlacement,
    img: headerPlacement === PLACEMENT.LEFT ? 'icon-chevron-up' : 'icon-chevron-left',
    type: ITEM_TYPE.PAGE_NAVIGATION_BUTTON,
    disabled: isFirstPage,
    ariaLabel: t('action.pagePrev'),
  };

  const nextPageButton = {
    onClick: () => {
      const documentViewer = core.getDocumentViewer();
      if (documentViewer.getCurrentPage() + 1 <= documentViewer.getPageCount()) {
        documentViewer.setCurrentPage(Math.min(documentViewer.getCurrentPage() + 1, documentViewer.getPageCount()));
      }
    },
    dataElement: DataElements.NEXT_PAGE_BUTTON,
    title: isLastPage ? null : t('action.pageNext'),
    label: size === 1 ? t('action.pageNext') : null,
    headerPlacement,
    img: headerPlacement === PLACEMENT.LEFT ? 'icon-chevron-down' : 'icon-chevron-right',
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
    />
  );
};

PageControlsContainer.propTypes = {
  dataElement: PropTypes.string.isRequired,
  headerPlacement: PropTypes.string,
  headerDirection: PropTypes.string,
};

export default PageControlsContainer;