import React, { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
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
import { getPageAdditionalControls, getPageManipulationControls } from 'helpers/pageManipulationFlyoutHelper';
import './ThumbnailControlsMulti.scss';
import PropTypes from 'prop-types';

// Values come from the CSS
const WIDTH_MARGINS = 16 + 8 + 16 + 16 + 16 + 16;

function ThumbnailControlsMultiContainer({ parentElement }) {
  const store = useStore();
  const dispatch = useDispatch();
  const isMobile = isInMobile();
  const [
    selectedPageIndexes,
    panelWidth,
    deleteModalEnabled,
    isDesktopOnlyMode,
  ] = useSelector((state) => [
    selectors.getSelectedThumbnailPageIndexes(state),
    !parentElement || parentElement === 'leftPanel' ? selectors.getLeftPanelWidth(state) : selectors.getPanelWidth(state, parentElement),
    selectors.pageDeletionConfirmationModalEnabled(state),
    selectors.isInDesktopOnlyMode(state),
  ]);

  const pageNumbers = selectedPageIndexes.map((index) => index + 1);

  const openInsertPageModal = () => {
    dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION_OVERLAY));
    dispatch(actions.openElement('insertPageModal'));
  };

  const onReplace = () => !noPagesSelectedWarning(pageNumbers, dispatch) && replace(dispatch);
  const onExtractPages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && extractPages(pageNumbers, dispatch);
  const onDeletePages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && deletePages(pageNumbers, dispatch, deleteModalEnabled);
  const onRotateClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateClockwise(pageNumbers);
  const onRotateCounterClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateCounterClockwise(pageNumbers);
  const onInsert = () => !noPagesSelectedWarning(pageNumbers, dispatch) && openInsertPageModal();
  const moveToTop = () => !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToTop(pageNumbers);
  const moveToBottom = () => !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToBottom(pageNumbers);

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
    const flyout = {
      dataElement: DataElements.PAGE_MANIPULATION_FLYOUT_MULTI_SELECT,
      className: DataElements.PAGE_MANIPULATION_FLYOUT_MULTI_SELECT,
      items: [
        ...(isPanelSmall ? getPageAdditionalControls(store, true) : []),
        ...(!isPanelLarge ? getPageManipulationControls(store, true) : []),
      ],
    };

    if (isPanelLarge) {
      dispatch(actions.closeElement(flyout.dataElement));
    }
    dispatch(actions.updateFlyout(flyout.dataElement, flyout));
  }, [store, isPanelLarge, isPanelSmall]);

  if (isXod || isOffice || document?.isWebViewerServerDocument()) {
    return (
      <div className={'PageControlContainer root small'}>
        <RotateOperations onRotateClockwise={onRotateClockwise}
          onRotateCounterClockwise={onRotateCounterClockwise}/>
      </div>
    );
  }

  const childProps = {
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

  return (<div className="PageControlContainer root">
    <RotateOperations {...childProps} />
    <div className="divider"/>
    {!isPanelSmall && <MoveOperations {...childProps} />}
    {!isPanelSmall && <div className="divider"/>}
    {isPanelLarge && <ManipulateOperations {...childProps} />}
    {!isPanelLarge && <div className="dropdown-menu">
      <ToggleElementButton
        dataElement={`${DataElements.PAGE_MANIPULATION_FLYOUT_MULTI_SELECT}Button`}
        toggleElement={DataElements.PAGE_MANIPULATION_FLYOUT_MULTI_SELECT}
        title="action.more"
        img="icon-tool-more"
        isMoreButton={true}
      />
      <div className="indicator"/>
    </div>}
  </div>);
}

ThumbnailControlsMultiContainer.propTypes = {
  parentElement: PropTypes.string,
};

export default ThumbnailControlsMultiContainer;
