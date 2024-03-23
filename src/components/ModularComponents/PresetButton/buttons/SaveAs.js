import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getPresetButtonDOM, menuItems } from '../../Helpers/menuItems';
import { workerTypes } from 'constants/types';
import core from 'core';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { innerItemToFlyoutItem } from 'helpers/itemToFlyoutHelper';
import { useTranslation } from 'react-i18next';

/**
 * A button that opens the save as modal.
 * @name saveAsButton
 * @memberof UI.Components.PresetButton
 */
const SaveAsButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label } = menuItems.saveAsButton;
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

  const isDisabled = documentType === workerTypes.XOD;

  if (isDisabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The save as preset button is not available for XOD documents.');
  }

  const handleClick = () => {
    dispatch(actions.openElement(DataElements.SAVE_MODAL));
  };
  return (
    isFlyoutItem ?
      innerItemToFlyoutItem({
        isDisabled,
        icon: iconDOMElement,
        label: t(label),
      }, handleClick)
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.SAVE_AS, isDisabled, handleClick)
  );
};

SaveAsButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default SaveAsButton;