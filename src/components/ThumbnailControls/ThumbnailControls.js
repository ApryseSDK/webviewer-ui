import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';

import './ThumbnailControls.scss';
import PageManipulationOverlayButton from 'components/PageManipulationOverlayButton';

const propTypes = {
  index: PropTypes.number.isRequired,
};

const dataElementName = 'thumbnailControl';

const ThumbnailControls = ({ index }) => {
  const [isElementDisabled] = useSelector(state => [selectors.isElementDisabled(state, dataElementName)]);
  const [isPageDeletionConfirmationModalEnabled] = useSelector(state => [selectors.pageDeletionConfirmationModalEnabled(state)]);

  const [t] = useTranslation();
  const dispatch = useDispatch();

  const rotateClockwise = () => {
    core.rotatePages([index + 1], window.Core.PageRotation.e_90);
  };

  const handleDelete = () => {
    if (isPageDeletionConfirmationModalEnabled) {
      let message = t('warning.deletePage.deleteMessage');
      const title = t('warning.deletePage.deleteTitle');
      const confirmButtonText = t('action.ok');

      let warning = {
        message,
        title,
        confirmButtonText,
        onConfirm: () => core.removePages([index + 1]),
      };

      if (core.getDocumentViewer().getPageCount() === 1) {
        message = t('warning.deletePage.deleteLastPageMessage');

        warning = {
          message,
          title,
          confirmButtonText,
          onConfirm: () => Promise.resolve(),
        };
      }

      dispatch(actions.showWarningMessage(warning));
    } else {
      core.removePages([index + 1])
    }
  };

  if (isElementDisabled) {
    return null;
  } else {
    return (
      <div className="thumbnailControls-overlay" data-element={dataElementName}>
        <Button
          className="rotate-button"
          img="icon-header-page-manipulation-page-rotation-clockwise-line"
          onClick={rotateClockwise}
          title="option.thumbnailPanel.rotateClockwise"
          dataElement="thumbRotateClockwise"
        />
        <Button
          className="delete-button"
          img="icon-delete-line"
          onClick={handleDelete}
          title="option.thumbnailPanel.delete"
          dataElement="thumbDelete"
        />
        <PageManipulationOverlayButton
          className={'more-options'}
          pageIndex={index}
        />
      </div>
    )
  }
};


ThumbnailControls.propTypes = propTypes;

export default ThumbnailControls;
