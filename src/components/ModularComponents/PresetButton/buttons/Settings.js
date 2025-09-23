import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import useFocusHandler from 'hooks/useFocusHandler';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that opens the settings modal.
 * @name settingsButton
 * @memberof UI.Components.PresetButton
 */
const SettingsButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    dataElement,
    className,
    style,
    img: icon,
    title,
  } = props;
  const dispatch = useDispatch();

  const handleSettingsButtonClick = () => {
    dispatch(actions.openElement(DataElements.SETTINGS_MODAL));
  };

  const handleClickWithFocus = useFocusHandler(handleSettingsButtonClick);

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClickWithFocus} />
      :
      getPresetButtonDOM({
        buttonType: PRESET_BUTTON_TYPES.SETTINGS,
        onClick: handleClickWithFocus,
        dataElement,
        className,
        style,
        icon,
        title,
      })
  );
});

SettingsButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
};
SettingsButton.displayName = 'SettingsButton';

export default SettingsButton;