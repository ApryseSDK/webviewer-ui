import React, { useState, useEffect, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { workerTypes } from 'constants/types';
import core from 'core';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import useFocusHandler from 'hooks/useFocusHandler';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that opens the save as modal.
 * @name saveAsButton
 * @memberof UI.Components.PresetButton
 */
const SaveAsButton = forwardRef((props, ref) => {
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

  const handleClick = () => {
    dispatch(actions.openElement(DataElements.SAVE_MODAL));
  };

  const handleSaveAsButtonClick = useFocusHandler(handleClick);

  const isDisabled = documentType === workerTypes.XOD;

  if (isDisabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The save as preset button is not available for XOD documents.');
  }

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleSaveAsButtonClick} />
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.SAVE_AS, isDisabled, handleSaveAsButtonClick)
  );
});

SaveAsButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
SaveAsButton.displayName = 'SaveAsButton';

export default SaveAsButton;