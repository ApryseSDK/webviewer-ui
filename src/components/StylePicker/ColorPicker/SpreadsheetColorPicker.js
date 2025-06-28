import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import actions from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import Button from 'components/Button';
import ColorPalette from 'components/ColorPalette';
import DataElementWrapper from 'components/DataElementWrapper';
import './ColorPicker.scss';
import { getColorFromHex, isColorTransparent, parseColor } from 'helpers/colorPickerHelper';
import useColorPickerAddColor from 'hooks/useColorPickerAddColor';
import useColorPickerDeleteColor from 'hooks/useColorPickerDeleteColor';
import useFocusHandler from 'hooks/useFocusHandler';
import difference from 'lodash/difference';
import { defaultBorderColor, defaultTextColor } from 'src/helpers/initialColorStates';

const propTypes = {
  onColorChange: PropTypes.func,
  property: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dataElement: PropTypes.string,
  ariaTypeLabel: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

const propertySetters = {
  CellBackgroundColor: 'setCellBackgroundColors',
  BorderColor: 'setBorderColors',
  TextColor: 'setTextColors',
};

const propertyGetters = {
  CellBackgroundColor: 'getCellBackgroundColors',
  BorderColor: 'getBorderColors',
  TextColor: 'getTextColors',
};

const SpreadsheetColorPicker = ({
  onColorChange,
  property,
  color: selectedColors,
  dataElement,
  ariaTypeLabel,
  onKeyDownHandler,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  if (!Array.isArray(selectedColors)) {
    selectedColors = [selectedColors];
  }
  const setterName = propertySetters[property];
  const getterName = propertyGetters[property];

  const cellStyleColors =  useSelector(selectors[getterName]);

  const [palette, setPalette] = useState(cellStyleColors);
  const [isExpanded, setIsExpanded] = useState(true);

  const newColors = difference(selectedColors.map(parseColor), palette);
  const areAllColorsInPalette = newColors.length === 0;

  const isTransparentColor = selectedColors.every(isColorTransparent);
  const isDefaultTextColor = selectedColors.every((color) => color?.toHexString?.() === defaultTextColor && property === 'TextColor');
  const isDefaultCellBorderColor = selectedColors.every((color) => color?.toHexString?.() === defaultBorderColor && property === 'BorderColor');

  const isCopyButtonDisabled = !selectedColors || areAllColorsInPalette || isTransparentColor;
  const isDeleteDisabled = palette.length <= 1 || !isCopyButtonDisabled || isTransparentColor || isDefaultTextColor || isDefaultCellBorderColor;
  const selectedColor = selectedColors.length === 1 ? selectedColors[0] : undefined;

  useEffect(() => {
    const colorsLowercase = cellStyleColors.map((color) => color.toLowerCase());

    if (!isExpanded) {
      setPalette(colorsLowercase.slice(0, 7));
      return;
    }

    setPalette(colorsLowercase);
  }, [cellStyleColors, isExpanded]);

  const toggleExpanded = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);
  };

  const handleAddColor = useFocusHandler(useColorPickerAddColor({
    colors: cellStyleColors,
    onColorChange,
    setColors: (newColors) => dispatch(actions[setterName](newColors)),
  }));

  const handleColorChange = (property, color) => {
    onColorChange(color);
  };

  const handleDelete = useColorPickerDeleteColor({
    selectedColor,
    colors: palette,
    onColorChange,
    transformFn: getColorFromHex,
    updateColorsAction: actions[setterName],
  });

  const handleCopyColor = () => {
    const newCellStyleColors = [...palette, ...newColors];
    dispatch(actions[setterName](newCellStyleColors));
  };

  return (
    <DataElementWrapper dataElement={dataElement}>
      <ColorPalette
        color={selectedColor}
        property={property}
        onStyleChange={handleColorChange}
        overridePalette2={palette}
        ariaTypeLabel={ariaTypeLabel}
        onKeyDownHandler={onKeyDownHandler}
      />
      <div className="palette-controls">
        <div className="button-container">
          <Button
            img="icon-header-zoom-in-line"
            title={t('action.addNewColor')}
            onClick={handleAddColor}
            className="control-button"
            dataElement="addCustomColor"
            ariaLabel={`${t('action.addNewColor')} ${t('action.fromCustomColorPicker')}`}
            onKeyDownHandler={onKeyDownHandler}
          />
          <Button
            img="icon-delete-line"
            title={t('action.deleteColor')}
            onClick={handleDelete}
            disabled={isDeleteDisabled}
            className="control-button"
            dataElement="deleteSelectedColor"
            ariaLabel={`${t('action.deleteColor')} ${selectedColor}`}
            onKeyDownHandler={onKeyDownHandler}
          />
          <Button
            img="icon-copy2"
            title={t('action.copySelectedColor')}
            onClick={handleCopyColor}
            disabled={isCopyButtonDisabled}
            className="control-button"
            dataElement="copySelectedColor"
            ariaLabel={`${t('action.copySelectedColor')} ${selectedColor}`}
            onKeyDownHandler={onKeyDownHandler}
          />
        </div>
        <button
          className={'show-more-button control-button'}
          onClick={toggleExpanded}
          aria-label={`${t(isExpanded ? t('action.showLessColors') : t('action.showMoreColors'))}`}
          onKeyDown={onKeyDownHandler}
        >
          {t(isExpanded ? 'message.showLess' : 'message.showMore')}
        </button>
      </div>
    </DataElementWrapper>
  );
};

SpreadsheetColorPicker.propTypes = propTypes;

export default SpreadsheetColorPicker;