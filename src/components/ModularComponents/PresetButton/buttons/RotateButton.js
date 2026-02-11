/**
 * A button that rotates the document pages clockwise by 90 degrees.
 * @name rotateClockwiseButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that rotates the document pages counterclockwise by 90 degrees.
 * @name rotateCounterClockwiseButton
 * @memberof UI.Components.PresetButton
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import useCore from 'hooks/useCore';
import { getIconDOMElement } from 'helpers/itemToFlyoutHelper';

const RotateButton = forwardRef((props, ref) => {
  const { isFlyoutItem, dataElement, className, style, buttonType } = props;

  const { core } = useCore();
  const isReaderMode = useSelector(selectors.isReaderMode);

  const shouldShow = !isReaderMode;

  let icon;
  let label;
  let title;
  let onClick;
  switch (buttonType) {
    case PRESET_BUTTON_TYPES.ROTATE_CLOCKWISE:
      icon = 'icon-header-page-manipulation-page-rotation-clockwise-line';
      label = 'action.rotateClockwise';
      title = 'action.rotateClockwise';
      onClick = () => {
        core.rotateClockwise();
      };
      break;
    case PRESET_BUTTON_TYPES.ROTATE_COUNTERCLOCKWISE:
      icon = 'icon-header-page-manipulation-page-rotation-counterclockwise-line';
      label = 'action.rotateCounterClockwise';
      title = 'action.rotateCounterClockwise';
      onClick = () => {
        core.rotateCounterClockwise();
      };
      break;
  }

  if (!shouldShow) {
    return null;
  }

  return isFlyoutItem ? (
    <FlyoutItemContainer
      {...props}
      label={label}
      title={title}
      ref={ref}
      onClick={onClick}
      icon={getIconDOMElement({ icon }, props.allFlyoutItems || [])}
    />
  ) : (
    getPresetButtonDOM({
      buttonType,
      onClick,
      dataElement,
      className,
      style,
      icon,
      title,
      label,
    })
  );
});

RotateButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
  buttonType: PropTypes.string,
  allFlyoutItems: PropTypes.array,
};
RotateButton.displayName = 'RotateButton';

export default RotateButton;