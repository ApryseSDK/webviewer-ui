/**
 * A button that opens the color picker for text formatting.
 * @name officeEditorColorPicker
 * @memberof UI.Components.PresetButton
 */

import React, { useEffect, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import ColorPickerOverlay from 'components/ColorPickerOverlay';
import Icon from 'components/Icon';
import useCore from 'hooks/useCore';
import actions from 'actions';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import DataElements from 'constants/dataElement';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};

const ColorPickerButton = forwardRef((props, ref) => {
  const menuItem = menuItems.officeEditorColorPicker;
  const overlayDataElement = DataElements.OFFICE_EDITOR_COLOR_PICKER_OVERLAY;

  const { core } = useCore();
  const [
    activeColor,
  ] = useSelector(
    (state) => [
      selectors.getActiveColor(state),
    ],
    shallowEqual,
  );

  const {
    isFlyoutItem,
    dataElement = menuItem.dataElement,
    img: icon = menuItem.icon,
    title = menuItem.title,
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const useColorIconBorder = activeColor?.toString() === 'rgba(255,255,255,1)';
  const ariaLabel = `${t(title)} ${activeColor?.toHexString()}`;

  const colorIcon = (
    <Icon
      dataElement={dataElement} // adding this dataElement to the icon to track the overlay position
      className={`${useColorIconBorder ? 'icon-border' : ''} icon-text-color menu-icon`}
      glyph={icon || 'icon-office-editor-circle'}
      color={activeColor?.toString()}
      ariaLabel={ariaLabel}
    />
  );

  const handleClick = () => {
    dispatch(actions.toggleElement(overlayDataElement));
  };

  const handleColorChange = (_, newColor) => {
    const color = {
      r: newColor.R,
      g: newColor.G,
      b: newColor.B,
    };
    core.getOfficeEditor().updateSelectionAndCursorStyle({ color });
    dispatch(actions.closeElements([overlayDataElement, 'officeEditorHomeToolsGroupedItemsFlyout']));
  };

  useEffect(() => {
    return () => {
      dispatch(actions.closeElement(overlayDataElement));
    };
  }, [dispatch, overlayDataElement]);

  return (
    <>
      {isFlyoutItem ?
        <FlyoutItemContainer
          {...props}
          ref={ref}
          onClick={handleClick}
          icon={colorIcon}
        />
        : (
          <ToggleElementButton
            dataElement={dataElement}
            title={title}
            ariaLabel={ariaLabel}
            img={icon}
            element={overlayDataElement}
            color={activeColor?.toString()}
            toggleElement={overlayDataElement}
            iconClassName={`${useColorIconBorder ? 'icon-border' : ''} icon-text-color`}
          />
        )}
      <ColorPickerOverlay
        onStyleChange={handleColorChange}
        color={activeColor}
        overlayDataElement={overlayDataElement}
        toggleButtonDataElement={dataElement}
      />
    </>
  );
});

ColorPickerButton.propTypes = propTypes;
ColorPickerButton.displayName = 'ColorPickerButton';

export default ColorPickerButton;