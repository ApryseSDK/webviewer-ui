import React from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { deletePages, rotateClockwise, rotateCounterClockwise } from 'helpers/pageManipulationFunctions';
import Button from 'components/Button';
import selectors from 'selectors';
import './ThumbnailControls.scss';
import PageManipulationOverlayButton from 'components/PageManipulationOverlayButton';
import { workerTypes } from 'constants/types';
import core from 'src/core';
import DataElements from 'constants/dataElement';
import { useTranslation } from 'react-i18next';

const propTypes = {
  index: PropTypes.number.isRequired,
};

const dataElementName = 'thumbnailControl';

const ThumbnailControls = ({ index }) => {
  const { t } = useTranslation();
  const [isElementDisabled] = useSelector((state) => [selectors.isElementDisabled(state, dataElementName)]);
  const [isMoreOptionDisabled] = useSelector((state) => [selectors.isElementDisabled(state, DataElements.PAGE_MANIPULATION_OVERLAY_BUTTON)]);
  const [isPageDeletionConfirmationModalEnabled, selectedIndexes] = useSelector((state) => [
    selectors.pageDeletionConfirmationModalEnabled(state),
    selectors.getSelectedThumbnailPageIndexes(state),
  ]);
  const dispatch = useDispatch();

  const [
    currentPage,
    pageThumbnailControlMenuItems,
    featureFlags,
  ] = useSelector((state) => [
    selectors.getCurrentPage(state),
    selectors.getThumbnailControlMenuItems(state),
    selectors.getFeatureFlags(state),
  ], shallowEqual);

  let pageNumbers = selectedIndexes.length > 0 ? selectedIndexes.map((i) => i + 1) : [index + 1];

  const isCurrentPageInTheSelection = pageNumbers.includes(currentPage);
  const customizableUI = featureFlags.customizableUI;

  if (!isCurrentPageInTheSelection) {
    pageNumbers = [currentPage];
  }

  const document = core.getDocument();
  const documentType = document?.type;
  const isXod = documentType === workerTypes.XOD;
  const isOffice = documentType === workerTypes.OFFICE || documentType === workerTypes.LEGACY_OFFICE;

  const BUTTONS_MAP = {
    'thumbRotateClockwise': <Button
      className="rotate-button"
      img="icon-header-page-manipulation-page-rotation-clockwise-line"
      onClick={() => rotateClockwise(pageNumbers)}
      title="option.thumbnailPanel.rotatePageClockwise"
      dataElement="thumbRotateClockwise"
    />,
    'thumbRotateCounterClockwise': <Button
      img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
      onClick={() => rotateCounterClockwise(pageNumbers)}
      title="option.thumbnailPanel.rotatePageCounterClockwise"
      dataElement="thumbRotateCounterClockwise"
    />,
    'thumbDelete': <Button
      className="delete-button"
      img="icon-delete-line"
      onClick={() => deletePages(pageNumbers, dispatch, isPageDeletionConfirmationModalEnabled)}
      title="option.thumbnailPanel.delete"
      dataElement="thumbDelete"
      onClickAnnouncement={`${t('action.delete')} ${t('action.modal')} ${t('action.isOpen')}`}
    />,
  };
  let isCustomized = false;
  const occurredButtons = [];
  const buttons = pageThumbnailControlMenuItems.map((item) => {
    const { dataElement } = item;
    const key = dataElement;
    let component = BUTTONS_MAP[dataElement];
    if (occurredButtons.indexOf(dataElement) > -1) {
      return null;
    }
    occurredButtons.push(dataElement);

    /* Example button object:
    {
      title: 'Alert me',
      img: '/path-to-image',
      onClick: (selectedPageNumbers) => alert(``),
      dataElement: 'alertMeDataElement',
    } */
    if (!component) {
      isCustomized = true;
      const { img, onClick, title } = item;
      component = <Button
        className={`${dataElement}-button`}
        img={img}
        onClick={() => onClick(currentPage)}
        title={title}
        dataElement={dataElement}
      />;
    }

    return component
      ? React.cloneElement(component, {
        key,
      })
      : null;
  });

  if (isElementDisabled) {
    return null;
  } if (isXod || isOffice || document?.isWebViewerServerDocument()) {
    return (
      <div className="thumbnailControls-overlay" data-element={dataElementName}
        style={{ display: 'flex' }}
      >
        <Button
          img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
          onClick={() => rotateCounterClockwise(pageNumbers)}
          title="option.thumbnailPanel.rotatePageCounterClockwise"
          dataElement="thumbRotateCounterClockwise"
        />
        <Button
          img="icon-header-page-manipulation-page-rotation-clockwise-line"
          onClick={() => rotateClockwise(pageNumbers)}
          title="option.thumbnailPanel.rotatePageClockwise"
          dataElement="thumbRotateClockwise"
        />
      </div>
    );
  }
  return (
    <div className={classNames({
      'thumbnailControls-overlay': true,
      'custom-buttons': isCustomized,
      'modular-ui': customizableUI,
    })}
    data-element={dataElementName}
    >
      {buttons}
      {
        (isMoreOptionDisabled) ? null : <PageManipulationOverlayButton
          className={'more-options'}
          pageIndex={index}
        />
      }

    </div>
  );
};


ThumbnailControls.propTypes = propTypes;

export default ThumbnailControls;
