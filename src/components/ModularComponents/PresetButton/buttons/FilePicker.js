import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import openFilePicker from 'helpers/openFilePicker';
import { getPresetButtonDOM, menuItems } from '../../Helpers/menuItems';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { innerItemToFlyoutItem } from 'helpers/itemToFlyoutHelper';
import { useTranslation } from 'react-i18next';

const FilePickerButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label } = menuItems.filePickerButton;
  const { t } = useTranslation();
  const [isDisabled] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.FILE_PICKER_BUTTON),
    ]
  );

  if (isDisabled) {
    console.warn('The file picker preset button should be enabled with the enableFilePicker option in the WebViewer constructor.');
  }

  return (
    isFlyoutItem ?
      innerItemToFlyoutItem({
        isDisabled,
        icon: iconDOMElement,
        label: t(label),
      }, openFilePicker)
      :
      getPresetButtonDOM(
        PRESET_BUTTON_TYPES.FILE_PICKER,
        isDisabled,
        openFilePicker
      )
  );
};

FilePickerButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default FilePickerButton;