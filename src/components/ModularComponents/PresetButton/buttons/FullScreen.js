import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import toggleFullscreen from 'helpers/toggleFullscreen';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that toggles fullscreen mode.
 * @name fullscreenButton
 * @memberof UI.Components.PresetButton
 */
const FullScreenButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const isFullScreen = useSelector((state) => selectors.isFullScreen(state));
  const label = isFullScreen ? 'action.exitFullscreen' : 'action.enterFullscreen';

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} label={label} ref={ref} onClick={toggleFullscreen} />
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.FULLSCREEN, false, toggleFullscreen, isFullScreen)
  );
});

FullScreenButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
FullScreenButton.displayName = 'FullScreenButton';

export default FullScreenButton;