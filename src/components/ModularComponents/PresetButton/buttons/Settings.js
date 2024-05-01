import { useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import { getPresetButtonDOM, menuItems } from '../../Helpers/menuItems';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { innerItemToFlyoutItem } from 'helpers/itemToFlyoutHelper';
import { useTranslation } from 'react-i18next';

/**
 * A button that opens the settings modal.
 * @name settingsButton
 * @memberof UI.Components.PresetButton
 */
const SettingsButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label } = menuItems.settingsButton;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSettingsButtonClick = () => {
    dispatch(actions.openElement(DataElements.SETTINGS_MODAL));
  };

  return (
    isFlyoutItem ?
      innerItemToFlyoutItem({
        isDisabled: false,
        icon: iconDOMElement,
        label: t(label),
      }, handleSettingsButtonClick)
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.SETTINGS, false, handleSettingsButtonClick)
  );
};

SettingsButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default SettingsButton;