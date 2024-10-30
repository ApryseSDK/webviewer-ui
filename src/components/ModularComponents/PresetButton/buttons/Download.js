import React, { useState, useEffect, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import downloadPdf from 'helpers/downloadPdf';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import core from 'core';
import { workerTypes } from 'constants/types';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that downloads the current document.
 * @name downloadButton
 * @memberof UI.Components.PresetButton
 */
const DownloadButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const [documentType, setDocumentType] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const onDocumentLoaded = () => {
      const type = core.getDocument()?.getType();
      setDocumentType(type);
    };
    onDocumentLoaded();
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
    };
  }, []);

  const isDisabled = documentType === workerTypes.XOD || isOfficeEditorMode();

  if (isDisabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The download preset button is not available for XOD documents or Office Editor mode.');
  }

  const handleClick = () => {
    downloadPdf(dispatch);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} />
      :
      getPresetButtonDOM(
        PRESET_BUTTON_TYPES.DOWNLOAD,
        isDisabled,
        handleClick)
  );
});

DownloadButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;