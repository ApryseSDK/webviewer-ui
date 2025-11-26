import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import downloadPdf from 'helpers/downloadPdf';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import core from 'core';
import { workerTypes } from 'constants/types';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import selectors from 'selectors';
import useOnDocumentUnloaded from 'hooks/useOnDocumentUnloaded';

/**
 * A button that downloads the current document.
 * @name downloadButton
 * @memberof UI.Components.PresetButton
 */
const DownloadButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    dataElement,
    className,
    style,
    img: icon,
    title,
  } = props;
  const [documentType, setDocumentType] = useState(null);
  const dispatch = useDispatch();
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  useEffect(() => {
    const onDocumentLoaded = (viewerKey) => {
      const document = core.getDocument(viewerKey);
      setDocumentType(document?.getType() || null);
    };

    onDocumentLoaded(activeDocumentViewerKey);
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => core.removeEventListener('documentLoaded', onDocumentLoaded);
  }, [activeDocumentViewerKey]);

  const handleDocumentUnloaded = useCallback(() => {
    setDocumentType(null);
  }, []);
  useOnDocumentUnloaded(handleDocumentUnloaded);

  const isDownloadSupported = documentType && !(documentType === workerTypes.XOD || isOfficeEditorMode());

  if (!documentType || !isDownloadSupported) {
    if (isFlyoutItem) {
      return null;
    }

    console.warn(
      !documentType
        ? 'The download preset button is not available because the document is not loaded.'
        : 'The download preset button is not available for XOD documents or Office Editor mode.'
    );
  }

  const handleClick = () => {
    downloadPdf(dispatch, { useDisplayAuthor: true }, activeDocumentViewerKey);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} />
      :
      getPresetButtonDOM({
        isDisabled: !isDownloadSupported,
        buttonType: PRESET_BUTTON_TYPES.DOWNLOAD,
        onClick: handleClick,
        dataElement,
        className,
        style,
        icon,
        title
      })
  );
});

DownloadButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
};
DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;