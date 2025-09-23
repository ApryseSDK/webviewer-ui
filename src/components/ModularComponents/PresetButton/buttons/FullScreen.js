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
  const {
    isFlyoutItem,
    dataElement,
    className,
    style,
    img: icon,
    title,
  } = props;
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
        dataElement,
        className,
        style,
        icon,
        title
      })
  );
});

FullScreenButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
};
FullScreenButton.displayName = 'FullScreenButton';

export default FullScreenButton;