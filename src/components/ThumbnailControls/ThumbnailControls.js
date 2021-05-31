import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';

import './ThumbnailControls.scss';

const propTypes = {
  index: PropTypes.number.isRequired,
};

const dataElementName = 'thumbnailControl';

const ThumbnailControls = ({ index }) => {
  const [isElementDisabled] = useSelector(state => [selectors.isElementDisabled(state, dataElementName)]);

  const [t] = useTranslation();
  const dispatch = useDispatch();

  const rotateClockwise = () => {
    core.rotatePages([index + 1], window.Core.PageRotation.e_90);
  };

  const rotateCounterClockwise = () => {
    core.rotatePages([index + 1], window.Core.PageRotation.e_270);
  };

  const handleDelete = () => {
    let message = t('warning.deletePage.deleteMessage');
    const title = t('warning.deletePage.deleteTitle');
    const confirmBtnText = t('action.ok');

    let warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => core.removePages([index + 1]),
    };

    if (core.getDocumentViewer().getPageCount() === 1) {
      message = t('warning.deletePage.deleteLastPageMessage');

      warning = {
        message,
        title,
        confirmBtnText,
        onConfirm: () => Promise.resolve(),
      };
    }

    dispatch(actions.showWarningMessage(warning));
  };

  return isElementDisabled ? null : (
    <div className="thumbnailControls" data-element={dataElementName}>
      <Button
        img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
        onClick={rotateCounterClockwise}
        title="option.thumbnailPanel.rotateCounterClockwise"
        dataElement="thumbRotateCounterClockwise"
      />
      <Button
        img="icon-delete-line"
        onClick={handleDelete}
        title="option.thumbnailPanel.delete"
        dataElement="thumbDelete"
      />
      <Button
        img="icon-header-page-manipulation-page-rotation-clockwise-line"
        onClick={rotateClockwise}
        title="option.thumbnailPanel.rotateClockwise"
        dataElement="thumbRotateClockwise"
      />
    </div>
  );
};

ThumbnailControls.propTypes = propTypes;

export default ThumbnailControls;
