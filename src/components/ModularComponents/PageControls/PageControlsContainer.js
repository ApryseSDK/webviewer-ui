import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import sizeManager from 'helpers/responsivenessHelper';
import PageControls from './PageControls';
import useDidUpdate from 'hooks/useDidUpdate';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ITEM_TYPE, PLACEMENT } from 'constants/customizationVariables';
import { isIOS } from 'helpers/device';
import { isMobileSize } from 'helpers/getDeviceSize';


const PageControlsContainer = ({ dataElement = 'page-controls-container', headerPlacement, headerDirection }) => {
  const [
    currentFlyout,
    size,
    totalPages,
    currentPage,
    pageLabels,
    allowPageNavigation,
  ] = useSelector((state) => [
    selectors.getFlyout(state, 'pageNavFlyoutMenu'),
    selectors.getCustomElementSize(state, dataElement),
    selectors.getTotalPages(state),
    selectors.getCurrentPage(state),
    selectors.getPageLabels(state),
    selectors.getAllowPageNavigation(state),
  ]);

  const isMobile = isMobileSize();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isFirstPage, setIsFirstPage] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState(pageLabels?.[currentPage - 1] ?? '');
  const elementRef = useRef();
  const inputRef = useRef();

  useDidUpdate(() => {
    if (pageLabels) {
      setInput(pageLabels[currentPage - 1]);
    }
  }, [pageLabels, currentPage]);

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
    let inputWidth = 0;
    if (input) {
      inputWidth = input.length * (isMobile ? 10 : 11.5);
    }
    const pageNavFlyoutMenu = {
      dataElement: 'pageNavFlyoutMenu',
      className: 'pageNavFlyoutMenu',
      items: [{
        dataElement: 'pageNavigationButton',
        currentPage,
        totalPages,
        input,
        label: 'pageNavigationButton',
        inputWidth,
        onClick: () => { },
        onChange: onChange,
        onSubmit: onSubmit,
        onBlur: onBlur,
        onFocus: onFocus,

      }, leftChevron, rightChevron]
    };

    if (!currentFlyout && size === 1) {
      dispatch(actions.addFlyout(pageNavFlyoutMenu));
    } else if (size === 1) {
      dispatch(actions.updateFlyout(pageNavFlyoutMenu.dataElement, pageNavFlyoutMenu));
    } else if (currentFlyout && size === 0) {
      dispatch(actions.removeFlyout(pageNavFlyoutMenu.dataElement));
    }
  }, [size, input, currentPage, totalPages]);

  useEffect(() => {
    dispatch(actions.disableElement('pageNavOverlay'));
  }, []);

  useDidUpdate(() => {
    const documentViewer = core.getDocumentViewer();
    setIsFirstPage(documentViewer.getCurrentPage() === 1);
    setIsLastPage(documentViewer.getCurrentPage() === documentViewer.getPageCount());
  }, [currentPage, totalPages]);

  const leftChevron = {
    onClick: () => {
      const documentViewer = core.getDocumentViewer();
      if (documentViewer.getCurrentPage() - 1 > 0) {
        documentViewer.setCurrentPage(Math.max(documentViewer.getCurrentPage() - 1, 1));
      }
    },
    dataElement: 'leftChevronBtn',
    title: isFirstPage ? null : t('action.pagePrev'),
    label: size === 1 ? t('action.pagePrev') : null,
    headerPlacement,
    img: headerPlacement === PLACEMENT.LEFT ? 'icon-chevron-up' : 'icon-chevron-left',
    type: ITEM_TYPE.BUTTON,
    disabled: isFirstPage,
    ariaLabel: t('action.pagePrev'),
  };

  const rightChevron = {
    onClick: () => {
      const documentViewer = core.getDocumentViewer();
      if (documentViewer.getCurrentPage() + 1 <= documentViewer.getPageCount()) {
        documentViewer.setCurrentPage(Math.min(documentViewer.getCurrentPage() + 1, documentViewer.getPageCount()));
      }
    },
    dataElement: 'rightChevronBtn',
    title: isLastPage ? null : t('action.pageNext'),
    label: size === 1 ? t('action.pageNext') : null,
    headerPlacement,
    img: headerPlacement === PLACEMENT.LEFT ? 'icon-chevron-down' : 'icon-chevron-right',
    type: ITEM_TYPE.BUTTON,
    disabled: isLastPage,
    ariaLabel: t('action.pageNext'),
  };

  const onClick = () => {
    if (isIOS) {
      setTimeout(() => {
        inputRef.current.setSelectionRange(0, 9999);
      }, 0);
    } else {
      inputRef.current.select();
    }
  };

  const onChange = (e) => {
    if (!pageLabels?.some((p) => p.startsWith(e.target.value))) {
      return;
    }
    setInput(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const isValidInput = input === '' || pageLabels.includes(input);
    if (isValidInput) {
      const pageToGo = pageLabels.indexOf(input) + 1;
      core.setCurrentPage(pageToGo);
    } else {
      inputRef.current.blur();
    }
  };

  const onBlur = () => {
    setInput(pageLabels[currentPage - 1]);
    setIsFocused(false);
  };

  const onFocus = () => setIsFocused(true);

  const onFlyoutToggle = () => {
    const dataElement = elementRef.current.getAttribute('data-element');
    dispatch(actions.setFlyoutToggleElement(dataElement));
  };

  return (
    <PageControls
      size={size}
      headerDirection={headerDirection}
      elementRef={elementRef}
      leftChevron={leftChevron}
      rightChevron={rightChevron}
      totalPages={totalPages}
      currentPage={currentPage}
      dataElement={dataElement}
      onFlyoutToggle={onFlyoutToggle}
      currentFlyout={currentFlyout}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
      onClick={onClick}
      onSubmit={onSubmit}
      isFocused={isFocused}
      input={input}
      inputRef={inputRef}
      allowPageNavigation={allowPageNavigation}
    />
  );
};

PageControlsContainer.propTypes = {
  dataElement: PropTypes.string.isRequired,
  headerPlacement: PropTypes.string,
  headerDirection: PropTypes.string,
};

export default PageControlsContainer;