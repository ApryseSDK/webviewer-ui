import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector, useStore, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import {
  deletePages,
  extractPages,
  noPagesSelectedWarning,
  replace,
  rotateClockwise,
  rotateCounterClockwise,
  movePagesToBottom,
  movePagesToTop
} from 'helpers/pageManipulationFunctions';
import { workerTypes } from 'constants/types';
import core from 'src/core';
import DataElements from 'constants/dataElement';
import { panelMinWidth } from 'constants/panel';
import { isMobile as isInMobile } from 'helpers/device';
import getRootNode from 'helpers/getRootNode';
import MoveOperations from './MoveOperations/MoveOperations';
import ManipulateOperations from './ManipulateOperations/ManipulateOperations';
import RotateOperations from './RotateOperations/RotateOperations';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import {
  getPageAdditionalControls,
  getPageManipulationControls,
  getPageRotationControls,
  getPageCustomControlsFlyout
} from 'helpers/pageManipulationFlyoutHelper';
import './ThumbnailControlsMulti.scss';
import PropTypes from 'prop-types';
import Button from 'components/Button';

// Values come from the CSS
const WIDTH_MARGINS = 16 + 8 + 16 + 16 + 16 + 16;

function ThumbnailControlsMultiContainer({ parentElement }) {
  const store = useStore();
  const dispatch = useDispatch();
  const isMobile = isInMobile();
  const selectedPageIndexes = useSelector(selectors.getSelectedThumbnailPageIndexes);
  const panelWidth = useSelector((state) => !parentElement || parentElement === 'leftPanel' ? selectors.getLeftPanelWidth(state) : selectors.getPanelWidth(state, parentElement));
  const deleteModalEnabled = useSelector(selectors.pageDeletionConfirmationModalEnabled);
  const isDesktopOnlyMode = useSelector(selectors.isInDesktopOnlyMode);
  const items = useSelector(selectors.getMultiPageManipulationControlsItems, shallowEqual);
  const [displayFlyout, setDisplayFlyout] = useState(false);

  const pageNumbers = useMemo(() =>
    selectedPageIndexes.map((index) => index + 1), [selectedPageIndexes]);

  const openInsertPageModal = () => {
    dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION_OVERLAY));
    dispatch(actions.openElement('insertPageModal'));
  };

  const childProps = useMemo(() => {
    const onReplace = () => !noPagesSelectedWarning(pageNumbers, dispatch) && replace(dispatch);
    const onExtractPages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && extractPages(pageNumbers, dispatch);
    const onDeletePages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && deletePages(pageNumbers, dispatch, deleteModalEnabled);
    const onRotateClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateClockwise(pageNumbers);
    const onRotateCounterClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateCounterClockwise(pageNumbers);
    const onInsert = () => !noPagesSelectedWarning(pageNumbers, dispatch) && openInsertPageModal();
    const moveToTop = () => !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToTop(pageNumbers);
    const moveToBottom = () => !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToBottom(pageNumbers);
    return {
      onReplace,
      onExtractPages,
      onDeletePages,
      onRotateCounterClockwise,
      onRotateClockwise,
      onInsert,
      moveToTop,
      moveToBottom,
      pageNumbers,
    };
  }, [pageNumbers, deleteModalEnabled]);

  const { onRotateClockwise, onRotateCounterClockwise } = childProps;

  const document = core.getDocument();
  const documentType = document?.type;
  const isXod = documentType === workerTypes.XOD;
  const isOffice = documentType === workerTypes.OFFICE || documentType === workerTypes.LEGACY_OFFICE;

  const smallBreakPoint = 190;
  const largeBreakPoint = 290;
  let widthMinusMargins;
  if (!isDesktopOnlyMode && isMobile) {
    try {
      const appRect = getRootNode().querySelector('.App').getBoundingClientRect();
      widthMinusMargins = appRect.width - WIDTH_MARGINS;
    } catch (e) {
      widthMinusMargins = (panelWidth || panelMinWidth) - WIDTH_MARGINS;
    }
  } else {
    widthMinusMargins = (panelWidth || panelMinWidth) - WIDTH_MARGINS;
  }
  const isPanelSmall = widthMinusMargins < smallBreakPoint;
  const isPanelLarge = widthMinusMargins > largeBreakPoint;

  useEffect(() => {
    const getFlyoutItemsFromType = (item) => {
      if (item.dataElement === 'leftPanelPageTabsRotate') {
        return getPageRotationControls(store, true);
      } else if (item.dataElement === 'leftPanelPageTabsMove') {
        return getPageAdditionalControls(store, true);
      } else if (item.dataElement === 'leftPanelPageTabsMore') {
        return getPageManipulationControls(store, true);
      } else if (item.type === 'customPageOperation') {
        return getPageCustomControlsFlyout(store, item);
      } else if (item.type === 'divider') {
        return ['divider'];
      }
    };
    const flyoutItems = [];
    let startIndex;
    if (isPanelSmall) {
      startIndex = 1;
    } else if (isPanelLarge) {
      startIndex = 3;
    } else {
      startIndex = 2;
    }
    let index = 0;
    items.forEach((item) => {
      let skip = false;
      if (index < startIndex || (flyoutItems.length === 0 && item?.type === 'divider')) {
        skip = true;
      }
      if (item && item.type !== 'divider') {
        index++;
      }
      !skip && flyoutItems.push(...getFlyoutItemsFromType(item));
    });
    const flyout = {
      dataElement: DataElements.PAGE_MANIPULATION_FLYOUT_MULTI_SELECT,
      className: DataElements.PAGE_MANIPULATION_FLYOUT_MULTI_SELECT,
      items: flyoutItems,
    };
    if (isPanelLarge) {
      dispatch(actions.closeElement(flyout.dataElement));
    }
    if (flyout.items.length) {
      dispatch(actions.updateFlyout(flyout.dataElement, flyout));
      setDisplayFlyout(true);
    } else {
      dispatch(actions.removeFlyout(flyout.dataElement));
      setDisplayFlyout(false);
    }
  }, [store, isPanelLarge, isPanelSmall, items]);

  const renderedItems = useMemo(() => {
    let lastDividerAdded = false;
    let index = 0;
    return items.map((item, actualIndex) => {
      let lastIndexToRender;
      if (isPanelSmall) {
        lastIndexToRender = 0;
      } else if (isPanelLarge) {
        lastIndexToRender = 2;
      } else {
        lastIndexToRender = 1;
      }
      if (item?.type === 'divider' && !lastDividerAdded) {
        if (index > lastIndexToRender) {
          lastDividerAdded = true;
        }
        return <div key={`divider${actualIndex}`} className="divider"/>;
      }
      if (index > lastIndexToRender) {
        return null;
      }
      if (item && item.type !== 'divider') {
        index++;
      }
      if (item.dataElement === 'leftPanelPageTabsRotate') {
        return <RotateOperations {...childProps} key="leftPanelPageTabsRotate"/>;
      } else if (item.dataElement === 'leftPanelPageTabsMove') {
        return <MoveOperations {...childProps} key="leftPanelPageTabsMove"/>;
      } else if (item.dataElement === 'leftPanelPageTabsMore') {
        return <ManipulateOperations {...childProps} key="leftPanelPageTabsMore"/>;
      } else if (item.type === 'customPageOperation') {
        if (!item.operations) {
          index--;
          return null;
        }
        return item.operations.map((operation) => (
          <Button
            key={operation.dataElement}
            className={'button-hover'}
            dataElement={operation.dataElement}
            img={operation.img}
            onClick={() => operation.onClick(pageNumbers)}
            title={operation.title}
          />
        ));
      }
      return null;
    });
  }, [items, childProps, isPanelSmall, isPanelLarge]);

  if (isXod || isOffice || document?.isWebViewerServerDocument()) {
    return (
      <div className={'PageControlContainer root small'}>
        <RotateOperations onRotateClockwise={onRotateClockwise}
          onRotateCounterClockwise={onRotateCounterClockwise}/>
      </div>
    );
  }

  return (<div className="PageControlContainer root">
    {renderedItems}
    {displayFlyout && <div className="dropdown-menu">
      <ToggleElementButton
        dataElement={`${DataElements.PAGE_MANIPULATION_FLYOUT_MULTI_SELECT}Button`}
        toggleElement={DataElements.PAGE_MANIPULATION_FLYOUT_MULTI_SELECT}
        title="action.more"
        img="icon-tool-more"
      />
      <div className="indicator"/>
    </div>}
  </div>);
}

ThumbnailControlsMultiContainer.propTypes = {
  parentElement: PropTypes.string,
};

export default ThumbnailControlsMultiContainer;
