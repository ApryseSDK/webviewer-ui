import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import downloadPdf from 'helpers/downloadPdf';
import { getPresetButtonDOM, menuItems } from '../../Helpers/menuItems';
import core from 'core';
import { workerTypes } from 'constants/types';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { innerItemToFlyoutItem } from 'helpers/itemToFlyoutHelper';
import { useTranslation } from 'react-i18next';

/**
 * A button that downloads the current document.
 * @name downloadButton
 * @memberof UI.Components.PresetButton
 */
const DownloadButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label } = menuItems.downloadButton;
  const [documentType, setDocumentType] = useState();
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
      innerItemToFlyoutItem({
        isDisabled,
        icon: iconDOMElement,
        label: t(label),
      }, handleClick)
      :
      getPresetButtonDOM(
        PRESET_BUTTON_TYPES.DOWNLOAD,
        isDisabled,
        handleClick)
  );
};

DownloadButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default DownloadButton;