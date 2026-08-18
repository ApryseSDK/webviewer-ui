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
import { TRANSPARENT_COLOR } from 'constants/officeEditor';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};

const HighlightColorPickerButton = forwardRef((props, ref) => {
  const menuItem = menuItems.officeEditorHighlightColorPicker;
  const overlayDataElement = DataElements.OFFICE_EDITOR_HIGHLIGHT_COLOR_PICKER_OVERLAY;

  const { core } = useCore();
  const [
    activeColor,
  ] = useSelector(
    (state) => [
      selectors.getActiveHighlightColor(state),
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
  const ariaLabel = t(title);

  const colorIcon = (
    <Icon
      dataElement={dataElement} // adding this dataElement to the icon to track the overlay position
      className={'icon-text-color menu-icon'}
      glyph={icon || 'icon-office-editor-circle'}
      color={activeColor?.toString()}
      ariaLabel={ariaLabel}
    />
  );

  const handleClick = () => {
    dispatch(actions.toggleElement(overlayDataElement));
  };

  const handleStyleChange = (_, newColor) => {
    const color = {
      r: newColor.R,
      g: newColor.G,
      b: newColor.B,
    };
    core.getOfficeEditor().updateSelectionAndCursorStyle({ highlightColor: color });
    dispatch(actions.closeElements([overlayDataElement, 'officeEditorHomeToolsGroupedItemsFlyout']));
  };

  const handleDefaultColorReset = () => {
    core.getOfficeEditor().updateSelectionAndCursorStyle({ highlightColor: TRANSPARENT_COLOR });
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
            iconClassName={'icon-text-color'}
          />
        )}
      <ColorPickerOverlay
        onStyleChange={handleStyleChange}
        onDefaultColorReset={handleDefaultColorReset}
        color={activeColor}
        overlayDataElement={overlayDataElement}
        toggleButtonDataElement={dataElement}
      />
    </>
  );
});

HighlightColorPickerButton.propTypes = propTypes;
HighlightColorPickerButton.displayName = 'HighlightColorPickerButton';

export default HighlightColorPickerButton;