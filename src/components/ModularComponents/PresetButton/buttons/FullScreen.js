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
  const { isFlyoutItem, className, style } = props;
  const isFullScreen = useSelector((state) => selectors.isFullScreen(state));
  const label = isFullScreen ? 'action.exitFullscreen' : 'action.enterFullscreen';

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} label={label} ref={ref} onClick={toggleFullscreen} />
      :
      getPresetButtonDOM({
        buttonType: PRESET_BUTTON_TYPES.FULLSCREEN,
        onClick: toggleFullscreen,
        isFullScreen,
        className,
        style,
      })
  );
});

FullScreenButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
FullScreenButton.displayName = 'FullScreenButton';

export default FullScreenButton;