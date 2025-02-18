import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import openFilePicker from 'helpers/openFilePicker';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that allows the opening of a file as the document in the UI.
 * @name filePickerButton
 * @memberof UI.Components.PresetButton
 */
const FilePickerButton = forwardRef((props, ref) => {
  const { isFlyoutItem, className, style } = props;
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.FILE_PICKER_BUTTON));

  if (isDisabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The file picker preset button should be enabled with the enableFilePicker option in the WebViewer constructor.');
  }

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={openFilePicker} />
      :
      getPresetButtonDOM({
        buttonType: PRESET_BUTTON_TYPES.FILE_PICKER,
        isDisabled,
        onClick: openFilePicker,
        className,
        style,
      })
  );
});

FilePickerButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
FilePickerButton.displayName = 'FilePickerButton';

export default FilePickerButton;