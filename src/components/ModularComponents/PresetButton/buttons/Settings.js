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
  const { isFlyoutItem, className, style } = props;
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
        className,
        style,
      })
  );
});

SettingsButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
SettingsButton.displayName = 'SettingsButton';

export default SettingsButton;