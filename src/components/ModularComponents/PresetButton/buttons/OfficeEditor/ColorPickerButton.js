/**
 * The preset color picker button for the Office Editor
 * @name officeEditorColorPicker
 * @memberof UI.Components.PresetButton
 */

import React, { useEffect, forwardRef } from 'react';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import ColorPickerOverlay from 'components/ColorPickerOverlay';
import Icon from 'components/Icon';
import core from 'core';
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
    dataElement = menuItems.officeEditorColorPicker.dataElement,
    img: icon = menuItems.officeEditorColorPicker.icon,
    title = menuItems.officeEditorColorPicker.title,
  } = props;

  const dispatch = useDispatch();

  const useColorIconBorder = activeColor.toString() === 'rgba(255,255,255,1)';
  const ariaLabel = activeColor.toHexString();

  const colorIcon = (
    <Icon
      dataElement={dataElement} // adding this dataElement to the icon to track the overlay position
      className={`${useColorIconBorder ? 'icon-border' : ''} icon-text-color menu-icon`}
      glyph={props.img || 'icon-office-editor-circle'}
      color={activeColor.toString()}
      ariaLabel={ariaLabel}
    />
  );

  const handleClick = () => {
    dispatch(actions.toggleElement(DataElements.OFFICE_EDITOR_COLOR_PICKER_OVERLAY));
  };

  useEffect(() => {
    return () => {
      dispatch(actions.closeElement(DataElements.OFFICE_EDITOR_COLOR_PICKER_OVERLAY));
    };
  }, []);

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
            element={DataElements.OFFICE_EDITOR_COLOR_PICKER_OVERLAY}
            color={activeColor.toString()}
            toggleElement={DataElements.OFFICE_EDITOR_COLOR_PICKER_OVERLAY}
            iconClassName={`${useColorIconBorder ? 'icon-border' : ''} icon-text-color`}
          />
        )}
      <ColorPickerOverlay
        onStyleChange={(_, newColor) => {
          const color = {
            r: newColor.R,
            g: newColor.G,
            b: newColor.B,
            a: 255,
          };
          core.getOfficeEditor().updateSelectionAndCursorStyle({ color });
          dispatch(actions.closeElements([DataElements.OFFICE_EDITOR_COLOR_PICKER_OVERLAY, 'officeEditorHomeToolsGroupedItemsFlyout']));
        }}
        color={activeColor}
        toggleButtonDataElement={dataElement}
      />
    </>
  );
});

ColorPickerButton.propTypes = propTypes;
ColorPickerButton.displayName = 'ColorPickerButton';

export default ColorPickerButton;