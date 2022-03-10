import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { deletePages, rotateClockwise, rotateCounterClockwise } from "helpers/pageManipulationFunctions";
import Button from 'components/Button';
import selectors from 'selectors';
import './ThumbnailControls.scss';
import PageManipulationOverlayButton from 'components/PageManipulationOverlayButton';
import { workerTypes } from "constants/types";
import core from "src/core";

const propTypes = {
  index: PropTypes.number.isRequired,
};

const dataElementName = 'thumbnailControl';

const ThumbnailControls = ({ index }) => {
  const [isElementDisabled] = useSelector(state => [selectors.isElementDisabled(state, dataElementName)]);
  const [isPageDeletionConfirmationModalEnabled, selectedIndexes] = useSelector(state => [
    selectors.pageDeletionConfirmationModalEnabled(state),
    selectors.getSelectedThumbnailPageIndexes(state),
  ]);
  const dispatch = useDispatch();

  const pageNumbers = selectedIndexes.length > 0 ? selectedIndexes.map(i => i + 1) : [index + 1];

  const document = core.getDocument();
  const documentType = document?.type;
  const isXod = documentType === workerTypes.XOD;
  const isOffice = documentType === workerTypes.OFFICE || documentType === workerTypes.LEGACY_OFFICE;

  if (isElementDisabled) {
    return null;
  } else if (isXod || isOffice || document?.isWebViewerServerDocument()) {
    return (
      <div className="thumbnailControls-overlay" data-element={dataElementName}
        style={{ display: 'flex' }}
      >
        <Button
          img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
          onClick={() => rotateCounterClockwise(pageNumbers)}
          title="option.thumbnailPanel.rotateCounterClockwise"
          dataElement="thumbRotateCounterClockwise"
        />
        <Button
          img="icon-header-page-manipulation-page-rotation-clockwise-line"
          onClick={() => rotateClockwise(pageNumbers)}
          title="option.thumbnailPanel.rotateClockwise"
          dataElement="thumbRotateClockwise"
        />
      </div>
    );
  } else {
    return (
      <div className="thumbnailControls-overlay" data-element={dataElementName}>
        <Button
          className="rotate-button"
          img="icon-header-page-manipulation-page-rotation-clockwise-line"
          onClick={() => rotateClockwise(pageNumbers)}
          title="option.thumbnailPanel.rotateClockwise"
          dataElement="thumbRotateClockwise"
        />
        <Button
          className="delete-button"
          img="icon-delete-line"
          onClick={() => deletePages(pageNumbers, dispatch, isPageDeletionConfirmationModalEnabled)}
          title="option.thumbnailPanel.delete"
          dataElement="thumbDelete"
        />
        <PageManipulationOverlayButton
          className={'more-options'}
          pageIndex={index}
        />
      </div>
    );
  }
};


ThumbnailControls.propTypes = propTypes;

export default ThumbnailControls;
