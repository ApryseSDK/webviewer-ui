import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import toggleFullscreen from 'helpers/toggleFullscreen';
import { innerItemToFlyoutItem } from 'src/helpers/itemToFlyoutHelper';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';

/**
 * A button that toggles fullscreen mode.
 * @name fullscreenButton
 * @memberof UI.Components.PresetButton
 */
const FullScreenButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { t } = useTranslation();
  const [
    isFullScreen,
  ] = useSelector(
    (state) => [
      selectors.isFullScreen(state),
    ],
  );

  return (
    isFlyoutItem ?
      innerItemToFlyoutItem({
        isDisabled: false,
        icon: iconDOMElement,
        label: isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen'),
      }, toggleFullscreen)
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.FULLSCREEN, false, toggleFullscreen, isFullScreen)
  );
};

FullScreenButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default FullScreenButton;