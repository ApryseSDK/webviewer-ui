import React, { forwardRef, useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import PropTypes from 'prop-types';
import core from 'core';
import { getPresetButtonDOM } from 'components/ModularComponents/Helpers/menuItems';
import FlyoutItemContainer from 'components/ModularComponents/FlyoutItemContainer';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';

/**
 * A button that toggles the accessibility mode on and off.
 * @name toggleAccessibilityModeButton
 * @memberof UI.Components.PresetButton
 */
const ToggleAccessibilityMode = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const store = useStore();
  const {
    isFlyoutItem,
    dataElement,
    className,
    style,
    img: icon,
    title,
  } = props;

  // This value comes from the "accessibleMode" property in the WebViewer constructor
  const isAccessibleMode = useSelector(selectors.isAccessibleMode);
  const shouldAddA11yContentToDOM = useSelector(selectors.shouldAddA11yContentToDOM);
  const accessibleReadingOrderManager = core.getDocumentViewer()?.getAccessibleReadingOrderManager();

  useEffect(() => {
    if (shouldAddA11yContentToDOM) {
      accessibleReadingOrderManager?.startAccessibleReadingOrderMode();
    } else {
      accessibleReadingOrderManager?.endAccessibleReadingOrderMode();
    }
  }, [shouldAddA11yContentToDOM]);

  const onClick = () => {
    const state = store.getState();
    if (!state.advanced.fullAPI && !isAccessibleMode) {
      console.warn('FullAPI is required to use accessibility mode');
      return;
    }
    dispatch(actions.setShouldAddA11yContentToDOM(!shouldAddA11yContentToDOM));
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={onClick} />
      : (
        getPresetButtonDOM({
          buttonType: PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE,
          onClick,
          isActive: shouldAddA11yContentToDOM,
          dataElement,
          className,
          style,
          icon,
          title,
        })
      )
  );
});

ToggleAccessibilityMode.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
};
ToggleAccessibilityMode.displayName = 'ToggleAccessibilityMode';

export default ToggleAccessibilityMode;